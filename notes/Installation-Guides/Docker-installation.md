# Summary

Installation of Docker Engine on Ubuntu server from Docker's official APT repository.

## Sources

- [Docker Documentation](https://docs.docker.com/engine/install/ubuntu/)

# Set up Docker's apt repository

## Add Docker's official GPG key

```bash
sudo apt update
sudo apt install -y ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings

sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

sudo chmod a+r /etc/apt/keyrings/docker.asc
```

## Add the repository to Apt sources

```bash
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

# Install Docker packages

```bash
sudo apt install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

# Check the status

```bash
sudo systemctl status docker
```

```bash
sudo docker run hello-world
```

# Use docker without sudo (optional)

```bash
sudo usermod -aG docker $USER
```
Then log out of your SSH session, log back in and test:

```bash
docker run hello-world
```
