# Summary

Calibre-web Automated installation on Ubuntu Server.

# Prerequisite

- [Docker installation](/notes/Installation-Guides/Docker-installation.md)

# Create directories for CWA

```bash
sudo mkdir -p /srv/calibre-web-automated/{config,ingest,library}
```

# Assign your user ownership

```bash
sudo chown -R UID:GID /srv/calibre-web-automated
```

Replace `UID` and `GID` with ids of your user. You can get them by running `id` command.

# Create `docker-compose.yml`

```bash
cd /srv/calibre-web-automated

sudo nano docker-compose.yml
```

```yaml
services:
  calibre-web-automated:
    image: ghcr.io/crocodilestick/calibre-web-automated:latest
    container_name: calibre-web-automated

    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Prague

    volumes:
      - ./config:/config
      - ./ingest:/cwa-book-ingest
      - ./library:/calibre-library

    ports:
      - "8083:8083"

    restart: unless-stopped
```

Note:
- Change the PUID/PGID to your user's values.

# Start CWA

```bash
docker compose pull
docker compose up -d
```

Check it's running:

```bash
docker compose ps
```

# Open CWA

Go to `http://YOUR-SERVER-IP:8083`.

The initial credentials are:

- Username: `admin`
- Password: `admin123`

# Enable uploads

After logging in, go to: 

- `Settings` → `Basic Configuration` → `Feature Configuration`
- Make sure Enable Uploads is enabled. 
- You can then configure the CWA-specific import behavior from its settings.

# Test your first ePub

You have two useful ways of adding books:

- use the CWA UI
- copy an EPUB into `/srv/calibre-web-automated/ingest/`