## Overview

Miniflux Installation Guide on Ubuntu Server (26.04 LTS)

## 1. Update Ubuntu
```bash
sudo apt update
sudo apt upgrade
```

## 2. Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib
```

## 3. Create PostgreSQL User and Database

SOpen the PostgreSQL shell:
```bash
sudo -u postgres psql
```

Create a dedicated database user:
```bash
CREATE USER miniflux WITH PASSWORD 'password';
```
Replace `password` with your password (keep single quotes = sql string literal).

Create the database owned by that user:
```bash
CREATE DATABASE miniflux2 OWNER miniflux;
```

Exit PostgreSQL:
```bash
\q
```

## 4. Add the Official Miniflux APT Repository
```bash
echo "deb [trusted=yes] https://repo.miniflux.app/apt/ * *" | sudo tee /etc/apt/sources.list.d/miniflux.list > /dev/null
```

Update package lists:
```bash
sudo apt update
```

## 5. Install Miniflux
```bash
sudo apt install miniflux
```

The Debian/Ubuntu package includes a systemd service.

## 6. Configure Miniflux

Edit the config file:
```bash
sudo nano /etc/miniflux.conf
```

Add the following to the end of the file (replace the password):
```ini
DATABASE_URL=user=miniflux password=YOUR_DATABASE_PASSWORD dbname=miniflux2 sslmode=disable

LISTEN_ADDR=127.0.0.1:8080

BASE_URL=https://rss.example.com

RUN_MIGRATIONS=1

LOG_DATE_TIME=1
```
Save and exit.

## 7. Run Database Migrations
```bash
sudo miniflux -migrate -config-file /etc/miniflux.conf
```

## 8. Create the Admin User
```bash
sudo miniflux -create-admin -config-file /etc/miniflux.conf
```

You will be prompted to enter the admin username and password.

## 9. Start and Enable Miniflux
```bash
sudo systemctl enable miniflux
sudo systemctl restart miniflux
```

Check status:
```bash
sudo systemctl status miniflux
```

## 10. Test Locally
```bash
curl http://127.0.0.1:8080
```

If it returns HTML, Miniflux is running.

## 11. (Optional) Expose with Nginx

Example for `rss.example.com`:

```bash
sudo nano /etc/nginx/sites-available/miniflux
```

```nginx
server {
    listen 80;
    server_name rss.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/miniflux /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Add HTTPS:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d rss.example.com
```

---

## Upgrade Later
```bash
sudo apt update
sudo apt upgrade miniflux
sudo miniflux -migrate -config-file /etc/miniflux.conf
sudo systemctl restart miniflux
```