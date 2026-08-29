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
    ca-certificates \
    nginx \
    certbot \
    python3-certbot-nginx
```

Check that nginx is running:

```bash
sudo systemctl status nginx
```

You can exit the status view with:

```text
q
```

If Ubuntu's firewall is enabled, check it:

```bash
sudo ufw status
```

If it is active, make sure SSH and nginx are allowed:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
```

---

# 2. Create the GoToSocial Directory

Create the GoToSocial installation and storage directories:

```bash
sudo mkdir -p /gotosocial/storage/certs
```

The resulting structure will initially look like:

```text
/gotosocial
└── storage
    └── certs
```

The `certs` directory is not actually required for this nginx/Certbot setup because nginx will manage the certificates, but keeping the standard GoToSocial directory structure does no harm.

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

Usually:

```text
x86_64
```

means:

```text
linux_amd64
```

and:

```text
aarch64
```

means:

```text
linux_arm64
```

Check the GoToSocial releases page and identify the latest **stable** version.

Do not use an RC or snapshot unless you specifically want a development build.

Set the version and architecture.

For example:

```bash
GTS_VERSION=0.22.1
GTS_TARGET=linux_amd64
```

Replace `0.22.1` with the current stable version if a newer release exists.

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

For this installation, use:

```yaml
host: "gts.example.net"
account-domain: "example.net"

bind-address: "127.0.0.1"
port: 8080

db-type: "sqlite"
db-address: "/gotosocial/storage/sqlite.db"

storage-local-base-path: "/gotosocial/storage"

letsencrypt-enabled: false

trusted-proxies:
  - "127.0.0.1/32"
  - "::1"

accounts-allow-custom-css: true
```

Save with:

```text
Ctrl+O
Enter
Ctrl+X
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

and that the working directory and executable point to `/gotosocial`.

For example, the relevant values should correspond to:

```text
WorkingDirectory=/gotosocial
ExecStart=/gotosocial/gotosocial --config-path /gotosocial/config.yaml server start
```

## Do NOT enable `CAP_NET_BIND_SERVICE`

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

You should see:

```text
syntax is ok
test is successful
```

Reload nginx:

```bash
sudo systemctl reload nginx
```

At this point nginx is listening for `gts.example.net`, although GoToSocial itself is intentionally not running yet.

---

# 7. Configure DNS

Go to:

```text
Cloudflare
→ example.net
→ DNS
→ Records
```

Create an `A` record:

```text
Type:          A
Name:          gts
IPv4 address:  YOUR_SERVER_PUBLIC_IPV4
Proxy status:  DNS only
TTL:           Auto
```

The important part is:

```text
gts.example.net → your Ubuntu server
```

I recommend using:

```text
DNS only
```

rather than the orange Cloudflare proxy for the GoToSocial hostname.

Your root domain remains unchanged:

```text
example.net → Cloudflare Pages
```

If your server also has properly configured public IPv6, you can additionally create an `AAAA` record:

```text
Type:          AAAA
Name:          gts
IPv6 address:  YOUR_SERVER_IPV6
Proxy status:  DNS only
```

Do not create the `AAAA` record unless IPv6 actually works on the server.

## Verify DNS

From your computer or server:

```bash
dig gts.example.net
```

or:

```bash
nslookup gts.example.net
```

It should return your server's public IP address.

Do not proceed with Certbot until DNS resolves correctly.

---

# 8. Obtain the TLS Certificate

Run:

```bash
sudo certbot --nginx -d gts.example.net
```

Certbot will ask for an email address and agreement to the Let's Encrypt terms.

If offered the choice to redirect HTTP to HTTPS, select HTTPS redirection.

After Certbot finishes, test nginx:

```bash
sudo nginx -t
```

Then reload it:

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

GoToSocial runs at:

```text
gts.example.net
```

but users are:

```text
@username@example.net
```

Fediverse servers therefore initially contact:

```text
example.net
```

to discover where the account actually lives.

The following three endpoints need to redirect from `example.net` to `gts.example.net`:

```text
/.well-known/webfinger
/.well-known/host-meta
/.well-known/nodeinfo
```

Do **not** redirect:

```text
/api/*
```

from `example.net` to `gts.example.net`.

Doing that can interfere with Fediverse client split-domain detection.

## Recommended Cloudflare configuration

Because WebFinger requires its query string to survive the redirect, a Cloudflare Redirect Rule is a particularly explicit way to configure this.

In Cloudflare open:

```text
example.net
→ Rules
→ Redirect Rules
```

Create a **Single Redirect**.

Give it a name such as:

```text
GoToSocial well-known endpoints
```

Use a custom filter expression equivalent to:

```text
(http.host eq "example.net" and http.request.uri.path in {"/.well-known/webfinger" "/.well-known/host-meta" "/.well-known/nodeinfo"})
```

For the redirect target choose a **Dynamic** redirect.

Use:

```text
concat("https://gts.example.net", http.request.uri.path)
```

Set:

```text
Status code:            301
Preserve query string:  Enabled
```

Save and deploy the rule.

This means that:

```text
https://example.net/.well-known/webfinger?resource=acct:something@example.net
```

becomes:

```text
https://gts.example.net/.well-known/webfinger?resource=acct:something@example.net
```

while your normal Cloudflare Pages website continues working normally:

```text
https://example.net/
https://example.net/about
https://example.net/blog
...
```

Only the three `/.well-known/...` endpoints are redirected.

### Why preserve the query string?

A WebFinger request contains the account being requested in the `resource` query parameter:

```text
?resource=acct:something@example.net
```

If that query parameter were dropped, GoToSocial would not know which account the remote Fediverse server is requesting.

---

# 10. Start GoToSocial

Everything necessary for the public-facing setup should now be ready.

Start the service:

```bash
sudo systemctl start gotosocial.service
```

Check its status:

```bash
sudo systemctl status gotosocial.service
```

It should show:

```text
active (running)
```

Exit with:

```text
q
```

If it fails, inspect the logs:

```bash
sudo journalctl \
    -u gotosocial.service \
    -n 100 \
    --no-pager
```

For live logs:

```bash
sudo journalctl \
    -u gotosocial.service \
    -f
```

GoToSocial will create its SQLite database during initial startup:

```text
/gotosocial/storage/sqlite.db
```

Verify that it exists:

```bash
sudo ls -lh /gotosocial/storage/sqlite.db
```

---

# 11. Verify the Instance

First test GoToSocial directly through its local nginx backend:

```bash
curl -I http://127.0.0.1:8080
```

Then test the public HTTPS endpoint:

```bash
curl -I https://gts.example.net
```

You should receive a valid HTTP response.

Open:

```text
https://gts.example.net
```

in a browser.

You should see the GoToSocial instance page.

Check that nginx is listening on the public HTTP/HTTPS ports:

```bash
sudo ss -tulpn | grep -E ':80|:443'
```

And check that GoToSocial itself only listens locally on port `8080`:

```bash
sudo ss -tulpn | grep 8080
```

You want something corresponding to:

```text
127.0.0.1:8080
```

and **not**:

```text
0.0.0.0:8080
```

This prevents users from bypassing nginx and accessing GoToSocial directly.

---

# 12. Create the GoToSocial Account

Choose:

```text
USERNAME
EMAIL
PASSWORD
```

For example, if:

```text
USERNAME=something
```

your public Fediverse handle will become:

```text
@something@example.net
```

Run the account creation command as the dedicated GoToSocial system user:

```bash
sudo -u gotosocial \
    /gotosocial/gotosocial \
    --config-path /gotosocial/config.yaml \
    admin account create \
    --username USERNAME \
    --email EMAIL \
    --password 'PASSWORD'
```

For example:

```bash
sudo -u gotosocial \
    /gotosocial/gotosocial \
    --config-path /gotosocial/config.yaml \
    admin account create \
    --username something \
    --email me@example.net \
    --password 'YOUR_SECURE_PASSWORD'
```

Using `sudo -u gotosocial` rather than running the command as root avoids accidentally creating database or storage files owned by root.

Your resulting Fediverse address is:

```text
@something@example.net
```

while your profile lives on:

```text
https://gts.example.net/@something
```

---

# 13. Promote the Account to Administrator

Run:

```bash
sudo -u gotosocial \
    /gotosocial/gotosocial \
    --config-path /gotosocial/config.yaml \
    admin account promote \
    --username USERNAME
```

For example:

```bash
sudo -u gotosocial \
    /gotosocial/gotosocial \
    --config-path /gotosocial/config.yaml \
    admin account promote \
    --username something
```

GoToSocial caches some account information, so admin promotion requires a service restart.

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