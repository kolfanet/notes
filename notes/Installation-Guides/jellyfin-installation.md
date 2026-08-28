## Overview

Jellyfin installation Guide on Ubuntu Server (26.04 LTS)

## Instal required packages

```bash
sudo apt install curl gnupg
```

## Enable the Universe repository

```bash
sudo add-apt-repository universe
```

Note:
- This provides some FFmpeg dependencies.

## Add the Jellyfin signing key

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://repo.jellyfin.org/jellyfin_team.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/jellyfin.gpg
```

Note:
- This allows APT to verify packages downloaded from the Jellyfin repository.

## Add the Jellyfin repository

```bash
export VERSION_OS="$( awk -F'=' '/^ID=/{ print $NF }' /etc/os-release )"
export VERSION_CODENAME="$( awk -F'=' '/^VERSION_CODENAME=/{ print $NF }' /etc/os-release )"
export DPKG_ARCHITECTURE="$( dpkg --print-architecture )"

cat <<EOF | sudo tee /etc/apt/sources.list.d/jellyfin.sources
Types: deb
URIs: https://repo.jellyfin.org/${VERSION_OS}
Suites: ${VERSION_CODENAME}
Components: main
Architectures: ${DPKG_ARCHITECTURE}
Signed-By: /etc/apt/keyrings/jellyfin.gpg
EOF
```

Note:
- This automatically detects your Ubuntu version (for example, **24.04 "noble"**) and CPU architecture.

## Install Jellyfin

```bash
sudo apt update
sudo apt install jellyfin
```

The `jellyfin` metapackage installs:
- `jellyfin-server`
- `jellyfin-web`
- the appropriate `jellyfin-ffmpeg`

## Start the service

```bash
sudo systemctl enable --now jellyfin
```

Check it's running:

```bash
systemctl status jellyfin
```

## Access Jellyfin

```txt
http://<your-server-ip>:8096
```

## Permission rights

Working assumptions:
- media are stored in `/srv/media` folder and `myUser` is the owner
- `jellyfin` user gets the right to read

### Create a dedicated group

```bash
sudo groupadd media
```

### Add users to the group

```bash
sudo usermod -aG media myUser
sudo usermod -aG media jellyfin
```

### Update folder ownership 

```bash
sudo chown -R fanda:media /srv/media
```

### Set permissions

For existing directories:

```bash
find /srv/media -type d -exec chmod 755 {} \;
```

For existing files:

```bash
find /srv/media -type f -exec chmod 644 {} \;
```

All new files to belong to the group:

```bash
sudo find /srv/media -type d -exec chmod g+s {} \;
```