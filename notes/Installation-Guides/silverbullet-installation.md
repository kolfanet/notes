## Overview 

SilverBullet installation on Ubuntu Server (26.04 LTS).

## Install required packages

```bash
sudo apt update
sudo apt install unzip curl
```

## Download SilverBullet

```bash
cd /tmp

curl -L \
  https://github.com/silverbulletmd/silverbullet/releases/latest/download/silverbullet-server-linux-x86_64.zip \
  -o silverbullet.zip
```

Unzip it:

```bash
unzip silverbullet.zip
```

You should now have:

```bash
ls -l silverbullet
```

Install the executable system-wide:

```bash
sudo install -m 755 silverbullet /usr/local/bin/silverbullet
```

Check it:

```bash
/usr/local/bin/silverbullet --help
```

Remove files in `/tmp` folder:

```bash
rm /tmp/silverbullet
rm /tmp/silverbullet.zip
```

## Create a dedicated SilverBullet user

```bash
sudo useradd \
  --system \
  --create-home \
  --home-dir /var/lib/silverbullet \
  --shell /usr/sbin/nologin \
  silverbullet
```

Create the data directory:

```bash
sudo mkdir -p /var/lib/silverbullet/data
sudo chown -R silverbullet:silverbullet /var/lib/silverbullet
```

Note:
- Your notes, configuration and SilverBullet data will then live under `/var/lib/silverbullet/data`

## Test SilverBullet manually

```bash
sudo -u silverbullet \
  /usr/local/bin/silverbullet /var/lib/silverbullet/data
```

You should see something indicating that SilverBullet is running on `http://localhost:3000`. Then `Ctrl + C`.

## Create a systemd service

```bash
sudo nano /etc/systemd/system/silverbullet.service
```

```bash
[Unit]
Description=SilverBullet
After=network.target

[Service]
Type=simple
User=silverbullet
Group=silverbullet

WorkingDirectory=/var/lib/silverbullet
ExecStart=/usr/local/bin/silverbullet /var/lib/silverbullet/data

Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable silverbullet
sudo systemctl start silverbullet
```

Check the status:

```bash
sudo systemctl status silverbullet
```

Check the logs:

```bash
sudo journalctl -u silverbullet
```

## Initial setup (via SSH tunnel)

```bash
ssh -L 3000:localhost:3000 YOUR_USER@YOUR_SERVER_IP
```

Then open on your computer `http://localhost:3000`.

## Create nginx configuration

```bash
sudo nano /etc/nginx/sites-available/silverbullet
```

```bash
server {
    listen 80;
    listen [::]:80;

    server_name note.example.net;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Enable nginx config

```bash
sudo ln -s /etc/nginx/sites-available/silverbullet \
  /etc/nginx/sites-enabled/silverbullet
```

Test it:

```bash
sudo nginx -t
```

Reload nginx:

```bash
sudo systemctl reload nginx
```

## Add HTTPS

```bash
sudo certbot --nginx -d note.example.net
```