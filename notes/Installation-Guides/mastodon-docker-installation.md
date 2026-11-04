# Summary

Installing Mastodon 4.7.5 on Ubuntu Server with Docker Compose.

# Prerequisite

- [Docker installation](/notes/Installation-Guides/Docker-installation.md)

# Download Mastodon

Create an installation directory:

```bash
sudo mkdir -p /opt/mastodon
sudo chown "$USER:$(id -gn)" /opt/mastodon
```

Clone the official repo:

```bash
cd /opt/mastodon
git clone https://github.com/mastodon/mastodon.git .
```

Check out the exact release:

```bash
git fetch --tags
git checkout v4.7.5
```

Verify:

```bash
git describe --tags --exact-match
```

- You should get `v4.7.5`.

# Configure Docker Compose

```bash
nano docker-compose.yml
```

Verify that the `web` and `sidekiq` services use:
```yaml
image: ghcr.io/mastodon/mastodon:v4.7.5
```

And the `streaming` service uses:
```yaml
image: ghcr.io/mastodon/mastodon-streaming:v4.7.5
```

The `build:` directives should remain commented out because we are using prebuilt images rather than building Mastodon from source.

Check that the published ports are bound only to localhost:
```yaml
# Under the web service
ports:
  - '127.0.0.1:3000:3000'

# Under the streaming service
ports:
  - '127.0.0.1:4000:4000'
```

Do not publish PostgreSQL or Redis ports.

## Validate the configuration

Save the `docker-compose.yml` and run:
```bash
sudo docker compose config --quiet
```

- If no errors appear, the YAML is structurally valid.

# Configure Mastodon

```bash
cp .env.production.sample .env.production
chmod 600 .env.production
```

```bash
nano .env.production
```

## Set your domain

```dotenv
LOCAL_DOMAIN=example.com
```
- Replace `example.com` with your real domain: `yourdomain.com` or `social.yourdomain.com`.

## PostgreSQL

```dotenv
DB_HOST=db
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASS=
```

## Redis

```dotenv
REDIS_HOST=redis
REDIS_PORT=6379
```

## Elasticsearch

```dotenv
ES_ENABLED=false
```

## SMTP (using Proton Mail)

```dotenv
SMTP_SERVER=smtp.protonmail.ch
SMTP_PORT=587
SMTP_LOGIN=mastodon@yourdomain.com
SMTP_PASSWORD=YOUR_PROTON_SMTP_TOKEN
SMTP_FROM_ADDRESS=mastodon@yourdomain.com
SMTP_AUTH_METHOD=plain
SMTP_ENABLE_STARTTLS=always
SMTP_TLS=false
```

## Media storage

For local storage:

```dotenv
S3_ENABLED=false
```

# Prepare persistent storage

The official Compose file uses local directories for PostgreSQL, Redis, and Mastodon media.

Create them:
```bash
mkdir -p postgres14 redis public/system
```


Set the media directory ownership for the Mastodon container:
```bash
sudo chown -R 991:991 public/system
```


Leave PostgreSQL and Redis directory ownership to their containers to initialize.

Verify the directories:
```bash
ls -ld postgres14 redis public/system
```

Don't change the ownership of public/system back to your regular user.

# Download images and start database services

Download the required images:
```bash
sudo docker compose pull
```

Start PostgreSQL and Redis:
```bash
sudo docker compose up -d db redis
```


Check:
```bash
sudo docker compose ps
```

You should see the db and redis containers running, eventually reporting healthy status.

If either fails, inspect the logs:
```bash
sudo docker compose logs --tail=100 db redis
```

Do not continue until both services are healthy.

# Generate application secrets

Mastodon needs cryptographic secrets for Rails, encrypted data, and push notifications.

Generate the Rails secret:
```bash
sudo docker compose run --rm web \
  bundle exec rails secret
```


Copy the output into .env.production as:
```dotenv
SECRET_KEY_BASE=YOUR_GENERATED_VALUE
```


Generate the Active Record encryption secrets:
```bash
sudo docker compose run --rm web \
  bin/rails db:encryption:init
```


Copy the three generated values into .env.production:
```dotenv
ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY=...
ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY=...
ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT=...
```


Generate VAPID keys:
```bash
sudo docker compose run --rm web \
  bundle exec rails mastodon:webpush:generate_vapid_key
```

Add the generated values:
```dotenv
VAPID_PRIVATE_KEY=...
VAPID_PUBLIC_KEY=...
```

After editing .env.production, save it and make a secure backup. These secrets must be preserved once your installation contains real data.

# Initialize the database

Make sure PostgreSQL is healthy:
```bash
sudo docker compose ps db
```


Initialize Mastodon:
```bash
sudo docker compose run --rm web \
  bundle exec rails db:setup
```

This creates the database schema and initializes the application data.

- If it succeeds, continue.
- If it fails, inspect the error and check the logs:
```bash
sudo docker compose logs --tail=100 db
```

A failure doesn't necessarily mean you need to start over. Correct the underlying problem first. If initialization was partially completed, determine which database operations succeeded before rerunning setup.

# Start Mastodon

Start application:
```bash
sudo docker compose up -d
```

Check container status:
```bash
sudo docker compose ps
```


You should see five services:
- db
- redis
- web
- streaming
- sidekiq

Check the logs:
```bash
sudo docker compose logs --tail=100
```


Test the local web service:
```bash
curl -fsS http://127.0.0.1:3000/health
```
- Expected output: OK


Test streaming:
```bash
curl -fsS \
  http://127.0.0.1:4000/api/v1/streaming/health
```


If either check fails, inspect its service logs:
```bash
sudo docker compose logs --tail=100 web
sudo docker compose logs --tail=100 streaming
```

At this stage, Mastodon should be running locally, but it isn't yet publicly accessible over HTTPS.

## Enable Redis memory overcommit

```bash
sudo sysctl -w vm.overcommit_memory=1
```

To make the setting persistent across reboots:
```bash
echo 'vm.overcommit_memory=1' | sudo tee /etc/sysctl.d/99-redis.conf
```

# Configure DNS

Create an A record for your Mastodon domain pointing to your server's public IPv4 address.

# Configure nginx

```bash
cd /opt/mastodon
sudo cp dist/nginx.conf /etc/nginx/sites-available/mastodon
```

```bash
sudo nano /etc/nginx/sites-available/mastodon
```

In both server blocks:
```yaml
server_name example.com;
root /opt/mastodon/public;
```

Then uncomment:
```yaml
try_files $uri @mastodon;
```

in each of these location blocks:
- /assets/
- /avatars/
- /emoji/
- /headers/
- /ocr/
- /packs/
- /sounds/
- /system/

This allows Mastodon to serve the files through its Docker web container.

Keep the existing upstream definitions for ports 3000 and 4000 unchanged.

## Temporarily disable the HTTPS server

Comment out the entire second `server { ... }` block, the one listening on port 443.

# Enable nginx configuration

```bash
sudo ln -s /etc/nginx/sites-available/mastodon /etc/nginx/sites-enabled/mastodon
```

Test:
```bash
sudo nginx -t
```

Reload nginx:
```bash
sudo systemctl reload nginx
```

# Request the Let's Encrypt certificate

```bash
sudo certbot certonly --nginx -d example.com
```

# Adjust nginx configuration

```bash
sudo nano /etc/nginx/sites-available/mastodon
```

- uncomment the entire second `server` block.
- uncomment the following lines and replace `example.com` with your domain:

```yaml
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

Test:
```bash
sudo nginx -t
```

Reload nginx:
```bash
sudo systemctl reload nginx
```

# Create your administrator account

```bash
cd /opt/mastodon
```

```bash
sudo docker compose exec web \
  bin/tootctl accounts create NEW_USERNAME \
  --email admin@example.com \
  --confirmed \
  --role Owner
```

Approve your account:
```bash
sudo docker compose exec web bin/tootctl accounts approve NEW_USERNAME
```