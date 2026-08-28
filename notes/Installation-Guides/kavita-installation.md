## Overview

Kavita installation on Ubuntu Server (26.04 LTS).

## Oficial source

- [Official documentation](https://wiki.kavitareader.com/installation/native/)

## Update Ubuntu

```bash
sudo apt update
sudo apt upgrade
```

## Download

```bash
cd /opt
sudo wget https://github.com/Kareadita/Kavita/releases/download/<version>/kavita-linux-x64.tar.gz
```

Replace `<version>` with the release version (e.g. v0.9.0.2).

## Extract

```bash
sudo tar -xzf kavita-linux-x64.tar.gz
sudo rm kavita-linux-x64.tar.gz
```

## Create service user

```bash
sudo adduser --system --group kavita
```

## Change ownership

```bash
sudo chown -R kavita:kavita /opt/Kavita
```

## Make it executable

```bash
sudo chmod +x /opt/Kavita/Kavita
```

## Create system service

```bash
sudo nano /etc/systemd/system/kavita.service
```

```bash
[Unit]
Description=Kavita Server
After=network.target

[Service]
User=kavita
Group=kavita
Type=simple
WorkingDirectory=/opt/Kavita
ExecStart=/opt/Kavita/Kavita
Restart=on-failure
TimeoutStopSec=20
KillMode=process

[Install]
WantedBy=multi-user.target
```

## Realod systemd

```bash
sudo systemctl daemon-reload
```

## Enable and start

```bash
sudo systemctl enable --now kavita
```

## Verify

```bash
systemctl status kavita
```

Logs:
```bash
journalctl -u kavita -f
```

## Access it

Open a browser window and go to: `http://localhost:5000/`

## Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/kavita
```

```bash
server {
    listen 80;
    listen [::]:80;

    server_name kavita.example.com;

    location / {
        proxy_pass http://127.0.0.1:5000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 600s;
        proxy_send_timeout 600s;

        client_max_body_size 0;
    }
}
```

## Enable Nginx configuration

```bash
sudo ln -s /etc/nginx/sites-available/kavita /etc/nginx/sites-enabled/kavita
```

Test:
```bash
sudo nginx -t
```

Reload Nginx:
```bash
sudo systemctl reload nginx
```

## Enable HTTPS

```bash
sudo certbot --nginx -d kavita.example.com
```

## Configure Kavita

Inside Kavita, open:

- Settings → Server Settings → General

Set:

- Host Name: `https://kavita.example.com`
- Base URL: `/`

Restart Kavita:

```bash
sudo systemctl restart kavita
```