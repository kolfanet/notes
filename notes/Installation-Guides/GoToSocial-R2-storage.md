# Enable Cloudflare R2 for an Existing GoToSocial Instance

This guide describes how to enable Cloudflare R2 for an existing GoToSocial instance. It assumes existing bare-metal [GoToSocial installation](/notes/Installation-Guides/GoToSocial-installation.md):

```txt
GoToSocial:       https://gts.example.net
R2 media domain:  https://media.example.net
Installation:     /gotosocial
Local media:      /gotosocial/storage
Database:         /gotosocial/sqlite.db
Service:          gotosocial.service
```

---

# Create the Cloudflare R2 Bucket

In the Cloudflare dashboard:

- Open `Storage & databases`
- Select `R2 Object Storage`
- Select `Create bucket`
- Use this bucket name: `gotosocial-media`
- Select `Standard` as the storage class.
- Choose a location hint reasonably close to your home server.
- Create the bucket.

Do not place the GoToSocial files inside an additional folder. The existing contents of `/gotosocial/storage` must eventually be stored directly at the bucket root.

# Create the R2 API Credentials

From the R2 overview:

- Select `Manage R2 API Tokens`
- Select `Create Account API Token`
- Name it: `GoToSocial`
- Select this permission: `Object Read & Write`
- Select `Apply to specific buckets only` and restrict it to `gotosocial-media`
- Set TTL to `Forever`
- In Client IP filtering leave both fields empty.
- Create the token.
- Save immediately the following values:
-   Access Key ID
-   Secret Access Key
-   S3 API endpoint

# Connect the Custom Media Domain

- Open: `R2` → `gotosocial-media` → `Settings` → `Custom Domains`
- Select `Add` and enter: `media.example.net`. Cloudflare should create the required DNS record automatically.
- Wait until the domain status becomes: `Active` and test it:

``` bash
curl -I https://media.example.net
```

A 404 at the bucket root is acceptable because there is no object at that path. What matters is that DNS and TLS work.

# Check the Existing Installation

Confirm the configured database and storage paths:

```bash
sudo grep -E \
    '^(db-type|db-address|storage-backend|storage-local-base-path):' \
    /gotosocial/config.yaml
```

You should see something similar to:

```bash
db-type: "sqlite"
db-address: "sqlite.db"
storage-local-base-path: "/gotosocial/storage"
```

Check how much media you currently have:

```bash
sudo du -sh /gotosocial/storage
```

Count the files:

```bash
sudo find /gotosocial/storage \
    -type f \
    | wc -l
```

Record both results so you can compare them with R2 later.

# Install MinIO Client

GoToSocial recommends MinIO Client, named mc, for migration to S3-compatible storage.

Check the architecture:

```bash
uname -m
```

For x86_64:

```bash
curl -fL \
    https://dl.min.io/aistor/mc/release/linux-amd64/mc \
    -o /tmp/mc
```

Install it:

```bash
sudo install \
    -m 0755 \
    /tmp/mc \
    /usr/local/bin/mc
```

Check it:

```bash
mc --version
```

# Connect MinIO Client to R2

Configure the alias using the credentials from Cloudflare:

```bash
sudo mc alias set \
    r2 \
    'https://ACCOUNT_ID.r2.cloudflarestorage.com' \
    'ACCESS_KEY_ID' \
    'SECRET_ACCESS_KEY' \
    --api S3v4
```

Keep the credentials inside single quotes.

Test access:

```bash
sudo mc ls r2/gotosocial-media
```

If the bucket is empty, successful output may simply be blank. Check the exit status:

```bash
echo $?
```

`0` means it worked.

Because this command was run with sudo, MinIO stores the credentials under root’s configuration. Do not make that configuration publicly readable.

# Perform the Initial Media Copy

You can perform the first copy while GoToSocial is running. This reduces the eventual downtime.

```bash
sudo mc mirror \
    --overwrite \
    /gotosocial/storage/ \
    r2/gotosocial-media/
```

Check the uploaded size:

```bash
sudo mc du r2/gotosocial-media
```

Count the uploaded objects:

```bash
sudo mc find \
    r2/gotosocial-media \
    --type f \
    | wc -l
```

The count should be close to the local file count. Minor differences can occur if GoToSocial created or removed cached remote media while the initial copy was running.

# Stop GoToSocial and Make a Backup

Stop the service:

```bash
sudo systemctl stop gotosocial.service
```

Confirm that it stopped:

```bash
systemctl is-active gotosocial.service
```

It should return: `inactive`

Create a protected backup directory:

```bash
sudo install \
    -d \
    -m 0700 \
    /root/gotosocial-before-r2
```

Back up the configuration and SQLite database:

```bash
sudo cp \
    -a \
    /gotosocial/config.yaml \
    /gotosocial/sqlite.db* \
    /root/gotosocial-before-r2/
```

The database contains the instance’s federation identity and private keys, so protecting it is essential.

# Perform the Final Media Copy

With GoToSocial stopped, repeat the mirror:

```bash
sudo mc mirror \
    --overwrite \
    /gotosocial/storage/ \
    r2/gotosocial-media/
```

This uploads any media that changed during the first copy.

Check the result again:

```bash
sudo mc du r2/gotosocial-media
```

Do not delete or rename `/gotosocial/storage`.

# Configure GoToSocial to Use R2

Open the configuration:

```bash
sudo nano /gotosocial/config.yaml
```

Replace:

```yaml
storage-local-base-path: "/gotosocial/storage"
```

with:

```yaml
storage-backend: "s3"

storage-s3-endpoint: "ACCOUNT_ID.r2.cloudflarestorage.com"
storage-s3-use-ssl: true

storage-s3-access-key: "YOUR_ACCESS_KEY_ID"
storage-s3-secret-key: "YOUR_SECRET_ACCESS_KEY"

storage-s3-bucket: "gotosocial-media"
storage-s3-bucket-lookup: "path"
storage-s3-region: "auto"

storage-s3-proxy: false
storage-s3-redirect-url: "https://media.example.net"
```

The complete relevant portion of your configuration should now resemble:

```yaml
host: "gts.example.net"
account-domain: "example.net"

bind-address: "127.0.0.1"
port: 8080

db-type: "sqlite"
db-address: "sqlite.db"

storage-backend: "s3"
storage-s3-endpoint: "ACCOUNT_ID.r2.cloudflarestorage.com"
storage-s3-use-ssl: true
storage-s3-access-key: "YOUR_ACCESS_KEY_ID"
storage-s3-secret-key: "YOUR_SECRET_ACCESS_KEY"
storage-s3-bucket: "gotosocial-media"
storage-s3-bucket-lookup: "path"
storage-s3-region: "auto"
storage-s3-proxy: false
storage-s3-redirect-url: "https://media.example.net"

letsencrypt-enabled: false

trusted-proxies:
  - "127.0.0.1/32"
  - "::1"

accounts-allow-custom-css: true
```

Important details:

- Do not include `https://` in storage-s3-endpoint.
- Do not include the bucket name in the endpoint.
- Do not add a trailing slash to `storage-s3-redirect-url`.
- Keep `storage-s3-proxy: false`. Setting it to true would send media through your home server and defeat the purpose of R2.
- `storage-local-base-path` may technically remain, but it is ignored with the S3 backend; removing it makes the active configuration clearer.

Protect the configuration because it now contains R2 credentials:

```bash
sudo chown \
    gotosocial:gotosocial \
    /gotosocial/config.yaml
```

```bash
sudo chmod \
    0600 \
    /gotosocial/config.yaml
```

# Start GoToSocial

Start the service:

```bash
sudo systemctl start gotosocial.service
```

Check its status:

```bash
sudo systemctl status \
    gotosocial.service \
    --no-pager
```

Inspect recent logs:

```bash
sudo journalctl \
    -u gotosocial.service \
    -n 100 \
    --no-pager
```

# Test Existing Media
# Test a New Upload
# Configure Cloudflare Caching
# Rollback Procedure