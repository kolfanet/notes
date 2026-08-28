## Summary

A few notes about Open SSH.

## Overview

OpenSSH allows you to open a command shell on another Linux server. It consists of two components:

- SSH client (to connect to another SSH Server)
- SSH server daemon (to accept SSH connections from other servers)

## Installation

### Checking the installation

**Client:**

```bash
which ssh
```

**Server:**

```bash
which sshd
```

### Installing Client and Server

#### Ubuntu:

```bash
sudo apt install openssh-client
sudo apt install openssh-server
```

#### Archlinux:

```bash
sudo pacman -S openssh
```

```bash
sudo systemctl enable sshd.service
sudo systemctl start sshd.service
```

## Connecting to the server

### Default connection

```bash
ssh <username>@<server-ip-address>
```

**Note:**

- Assumes the server listens on the default port 22
- You’ll be asked for the username’s password

### Connecting to the server on specific port

```bash
ssh -p 2243 <username>@<server-ip-address>
```

### SSH port forwarding

```bash
ssh -L 8081:localhost:8081 youruser@server-ip
```

- Opens port `8081` on local machine
- Forwards it to `localhost:8081` on the server
- Lets you access it via `http://localhost:8081` locally

## SSH keys

### SSH Keys Generation

Instead of using a user's password for authentication, you can use SSH keys.

```bash
ssh-keygen
```

**Note:**

- Generates Ed25519 keys and stores them in:
  - `~/.ssh/id_ed25519` — private key
  - `~/.ssh/id_ed25519.pub` — public key

### Copy Public Key to Another Server

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub <username>@<server-ip-address>
```

**Note:**

- You’ll be asked for the username’s password
- Copies your public key into `~/.ssh/authorized_keys` on the server
- You can copy it manually as well if password authentication is disabled

## Security enhancements

### Disable Password Authentication

**IMPORTANT:** First make sure you have an alternate means of authenticating before switching password authentication off.

#### Edit SSH Configuration

```bash
sudo nano /etc/ssh/sshd_config
```

Make sure the following line is uncommented and set to `no`:

```text
PasswordAuthentication no
```

#### Restart SSH

```bash
sudo systemctl restart ssh
```

### Disable Root SSH Connection

#### Edit SSH Configuration

```bash
sudo nano /etc/ssh/sshd_config
```

Make sure the following line is uncommented and set to `no`:

```text
PermitRootLogin no
```

**Note:**

- By default, the option is set to `prohibit-password`

#### Restart SSH

```bash
sudo systemctl restart ssh
```

## Miscellaneous

### Copy File via SSH

#### File to a remote server

```bash
scp /path/to/file.txt <username>@<server-ip-address>:/copy/to/folder
```

#### File from a remote server

```bash
scp <username>@<server-ip-address>:/path/to/file.txt /copy/to/folder
```

### Copy Directory via SSH

#### Directory to a remote server

```bash
scp -r /path/to/directory <username>@<server-ip-address>:/copy/to/folder
```

#### Directory from a remote server

```bash
scp -r <username>@<server-ip-address>:/path/to/directory /copy/to/folder
```
