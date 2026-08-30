# Install GoToSocial on Ubuntu

This guide describes a bare-metal installation of GoToSocial on Ubuntu using:

- SQLite
- nginx as reverse proxy
- Certbot / Let's Encrypt for TLS
- Cloudflare for DNS
- Cloudflare Pages for the main website

The configuration used in this guide is:

```text
Website:
https://example.net

GoToSocial:
https://gts.example.net

Fediverse account:
@something@example.net
```

GoToSocial itself runs on `gts.example.net`, while the `account-domain` setting makes user accounts appear as `@username@example.net`.

> **Important:** Configure the split-domain setup before using the instance or federating with other servers. Do not change `host` or `account-domain` later.

---

# 1. Install Required Packages

Update the system:

```bash
sudo apt update
sudo apt upgrade
```

Install the required packages:

```bash
sudo apt install -y \
    wget \
    curl \
    nginx \
    certbot \
    python3-certbot-nginx
```
---

# 2. Create the GoToSocial Directory

Create the GoToSocial installation and storage directories:

```bash
sudo mkdir -p /gotosocial/storage/certs
```

Note: 
- The `certs` directory is not actually required for this nginx/Certbot setup because nginx will manage the certificates, but keeping the standard GoToSocial directory structure does no harm.

---

# 3. Download the Stable GoToSocial Release

Change to the installation directory:

```bash
cd /gotosocial
```

Check the CPU architecture:

```bash
uname -m
```

Usually `x86_64` means `linux_amd64` and `aarch64` means `linux_arm64`.

Check the GoToSocial [releases](https://codeberg.org/superseriousbusiness/gotosocial/releases) page and identify the latest **stable** version and set the version and architecture. For example:

```bash
GTS_VERSION=0.22.1
GTS_TARGET=linux_amd64
```
Download it:

```bash
sudo wget \
    https://codeberg.org/superseriousbusiness/gotosocial/releases/download/v${GTS_VERSION}/gotosocial_${GTS_VERSION}_${GTS_TARGET}.tar.gz
```

Extract it:

```bash
sudo tar -xzf \
    gotosocial_${GTS_VERSION}_${GTS_TARGET}.tar.gz
```

You should now have something similar to:

```text
/gotosocial/
├── example/
├── gotosocial
├── storage/
└── web/
```

Check the installed version:

```bash
/gotosocial/gotosocial --version
```

Optionally remove the downloaded archive:

```bash
sudo rm \
    /gotosocial/gotosocial_${GTS_VERSION}_${GTS_TARGET}.tar.gz
```

---

# 4. Create `config.yaml`

Copy the example configuration:

```bash
sudo cp \
    /gotosocial/example/config.yaml \
    /gotosocial/config.yaml
```

Edit it:

```bash
sudo nano /gotosocial/config.yaml
```

It is recommended to keep only values that differ from GoToSocial defaults.

For this installation guide, use:

```yaml
host: "gts.example.net"
account-domain: "example.net"

bind-address: "127.0.0.1"
port: 8080

db-type: "sqlite"
db-address: "sqlite.db"

storage-local-base-path: "/gotosocial/storage"

letsencrypt-enabled: false

trusted-proxies:
  - "127.0.0.1/32"
  - "::1"

accounts-allow-custom-css: true
```

## Understanding `host` and `account-domain`

This is the important part of the configuration:

```yaml
host: "gts.example.net"
account-domain: "example.net"
```

`host` is where GoToSocial actually runs:

```text
https://gts.example.net
```

`account-domain` is what appears in Fediverse usernames:

```text
@something@example.net
```

A user's actual profile URL will still be something such as:

```text
https://gts.example.net/@something
```

That is normal.

Because nginx handles HTTPS, GoToSocial itself only listens locally:

```yaml
bind-address: "127.0.0.1"
port: 8080
```

This means port `8080` is not exposed to the Internet.

---

# 5. Configure the systemd User and Service

Create a dedicated system user and group:

```bash
sudo adduser \
    --system \
    --group \
    --home /gotosocial \
    --no-create-home \
    gotosocial
```

Give the GoToSocial user ownership of the installation:

```bash
sudo chown -R gotosocial:gotosocial /gotosocial
```

Copy the provided systemd service:

```bash
sudo cp \
    /gotosocial/example/gotosocial.service \
    /etc/systemd/system/gotosocial.service
```

Open it:

```bash
sudo nano /etc/systemd/system/gotosocial.service
```

Verify that the service uses:

```text
User=gotosocial
Group=gotosocial
```

and that the working directory and executable point to `/gotosocial`:

```text
WorkingDirectory=/gotosocial
ExecStart=/gotosocial/gotosocial --config-path config.yaml server start
```

Leave this line commented if present:

```text
#AmbientCapabilities=CAP_NET_BIND_SERVICE
```

GoToSocial is listening on:

```text
127.0.0.1:8080
```

rather than directly on ports 80 or 443, so it does not need permission to bind privileged ports.

Reload systemd:

```bash
sudo systemctl daemon-reload
```

Enable GoToSocial at boot, but **do not start it yet**:

```bash
sudo systemctl enable gotosocial.service
```

Check:

```bash
systemctl is-enabled gotosocial.service
```

It should return:

```text
enabled
```

---

# 6. Configure nginx

Create the nginx virtual host:

```bash
sudo nano /etc/nginx/sites-available/gotosocial.conf
```

Add:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name gts.example.net;

    location / {
        proxy_pass http://127.0.0.1:8080;

        proxy_set_header Host $host;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 40M;
}
```

The following header is especially important:

```nginx
proxy_set_header Host $host;
```

GoToSocial requires the proxy and GTS to agree on the externally visible hostname.

Enable the site:

```bash
sudo ln -s \
    /etc/nginx/sites-available/gotosocial.conf \
    /etc/nginx/sites-enabled/gotosocial.conf
```

Test nginx:

```bash
sudo nginx -t
```

Reload nginx:

```bash
sudo systemctl reload nginx
```

At this point nginx is listening for `gts.example.net`, although GoToSocial itself is intentionally not running yet.

---

# 7. Configure DNS

Create an `A` record:

```text
Type:          A
Name:          gts
IPv4 address:  YOUR_SERVER_PUBLIC_IPV4
Proxy status:  DNS only
TTL:           Auto
```

If your server also has properly configured public IPv6, you can additionally create an `AAAA` record:

```text
Type:          AAAA
Name:          gts
IPv6 address:  YOUR_SERVER_IPV6
Proxy status:  DNS only
```

Do not create the `AAAA` record unless IPv6 actually works on the server.

---

# 8. Obtain the TLS Certificate

```bash
sudo certbot --nginx -d gts.example.net
```

Test nginx:

```bash
sudo nginx -t
```

Reload it:

```bash
sudo systemctl reload nginx
```

Check the certificate:

```bash
sudo certbot certificates
```

You should see a certificate for:

```text
gts.example.net
```

Certbot normally installs automatic certificate renewal. Verify its timer:

```bash
systemctl status certbot.timer
```

You can also test renewal:

```bash
sudo certbot renew --dry-run
```

---

# 9. Configure the Split-Domain Redirects on Cloudflare

In Cloudflare open `example.net` > `Rules` > `Create Rule (Redirect Rule)`

Rule name:

```text
GoToSocial well-known endpoints
```

In section for matching condition select `Custom filter expression` and then `Edit expression`:

```text
(http.host eq "example.net" and http.request.uri.path in {"/.well-known/webfinger" "/.well-known/host-meta" "/.well-known/nodeinfo"})
```

In URL redirect section:

Type: `Dynamic`
URL: `concat("https://gts.example.net", http.request.uri.path)`
Status code: `301`

Also make sure you check `Preserve query string`.

Select order: `First`

---

# 10. Start GoToSocial

Start the service:

```bash
sudo systemctl start gotosocial.service
```

Check its status:

```bash
sudo systemctl status gotosocial.service
```

GoToSocial will create its SQLite database during initial startup:

```text
/gotosocial/sqlite.db
```

Verify that it exists:

```bash
sudo ls -lh /gotosocial/sqlite.db
```

---

# 11. Create the GoToSocial Account

```bash
sudo -u gotosocial \
    /gotosocial/gotosocial \
    --config-path /gotosocial/config.yaml \
    admin account create \
    --username USERNAME \
    --email EMAIL \
    --password 'PASSWORD'
```

---

# 12. Promote the Account to Administrator

```bash
sudo -u gotosocial \
    /gotosocial/gotosocial \
    --config-path /gotosocial/config.yaml \
    admin account promote \
    --username USERNAME
```

---

# 14. Restart GoToSocial

Restart:

```bash
sudo systemctl restart gotosocial.service
```

Verify:

```bash
sudo systemctl status gotosocial.service
```

Check recent logs:

```bash
sudo journalctl \
    -u gotosocial.service \
    -n 50 \
    --no-pager
```

At this point you should be able to log in through:

```text
https://gts.example.net
```

using the email address and password created above.

---

# 15. Test WebFinger

This is the most important test for the split-domain setup.

Suppose your account is:

```text
@something@example.net
```

## Test the redirect

Run:

```bash
curl -I \
    'https://example.net/.well-known/webfinger?resource=acct:something@example.net'
```

You should receive a redirect such as:

```text
HTTP/2 301
location: https://gts.example.net/.well-known/webfinger?resource=acct:something@example.net
```

The important things are:

```text
301 redirect
```

and that the destination still contains:

```text
?resource=acct:something@example.net
```

## Follow the redirect

Now run:

```bash
curl -L \
    'https://example.net/.well-known/webfinger?resource=acct:something@example.net'
```

You should receive JSON describing the GoToSocial account.

It should contain values corresponding to:

```text
acct:something@example.net
```

and links pointing to:

```text
https://gts.example.net/...
```

This combination is exactly what you want:

```text
Fediverse identity
@something@example.net

Actual GTS host
gts.example.net
```

## Test the other discovery endpoints

Run:

```bash
curl -I \
    https://example.net/.well-known/host-meta
```

and:

```bash
curl -I \
    https://example.net/.well-known/nodeinfo
```

Both should redirect to the corresponding endpoint at:

```text
https://gts.example.net
```

You can test their final responses with:

```bash
curl -L \
    https://example.net/.well-known/host-meta
```

and:

```bash
curl -L \
    https://example.net/.well-known/nodeinfo
```

---

# 16. Final Checks

Your final architecture should be:

```text
                        Internet
                           │
             ┌─────────────┴──────────────┐
             │                            │
             ▼                            ▼

       example.net                  gts.example.net
    Cloudflare Pages                    DNS
             │                            │
             │                            ▼
             │                       Ubuntu VPS
             │                            │
             │                           nginx
             │                          :80/:443
             │                            │
             │                            ▼
             │                    127.0.0.1:8080
             │                       GoToSocial
             │
             │
             └─ /.well-known/webfinger ───────►
             └─ /.well-known/host-meta ───────►
             └─ /.well-known/nodeinfo ─────────►
```

Your public identities then look like:

```text
Website:
https://example.net

GoToSocial server:
https://gts.example.net

Profile:
https://gts.example.net/@something

Fediverse handle:
@something@example.net
```

---

# 17. Useful Administration Commands

Check status:

```bash
sudo systemctl status gotosocial
```

Restart:

```bash
sudo systemctl restart gotosocial
```

Stop:

```bash
sudo systemctl stop gotosocial
```

Start:

```bash
sudo systemctl start gotosocial
```

Follow logs:

```bash
sudo journalctl -u gotosocial -f
```

Show recent logs:

```bash
sudo journalctl \
    -u gotosocial \
    -n 100 \
    --no-pager
```

Check nginx:

```bash
sudo nginx -t
```

Reload nginx:

```bash
sudo systemctl reload nginx
```

Check certificates:

```bash
sudo certbot certificates
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

---

# 18. Important Things Not to Change Later

Once the instance starts federating, treat these as permanent:

```yaml
host: "gts.example.net"
account-domain: "example.net"
```

Do not casually change either one.

Remote Fediverse servers cache account/domain discovery information and ActivityPub identities are tied to the instance hostname.

Other settings such as:

```yaml
accounts-allow-custom-css
instance-languages
media-remote-cache-days
smtp-*
```

can be changed later followed by:

```bash
sudo systemctl restart gotosocial
```

---

# Done

Once all tests pass, you have:

```text
GoToSocial:
https://gts.example.net

Fediverse account:
@something@example.net

Website:
https://example.net
```

with your normal website remaining on Cloudflare Pages and GoToSocial running independently on your Ubuntu server.