## Summary

A few notes on Nginx installation and its management on the Ubuntu server.

## Sources

- [Ubuntu server documentation](https://ubuntu.com/server/docs/how-to/web-services/install-nginx/)

## Installation

```bash
sudo apt install nginx
```

## Check Nginx status

```bash
sudo systemctl status nginx
```

## Nginx default configuration

- After installation, nginx home page can be loaded at `http://your_server_ip`
- Nginx default configuration is stored at `/etc/nginx/sites-available/`
- Default nginx homepage is served from the following directory: `/var/www/html`

## Symlinks - Enable / Disable Sites

- Symlink is a shortcut to a configuration file located in `/etc/nginx/sites-available/`. It allows Nginx to recognize and load a website’s configuration.
- Symlinks are stored at `/etc/nginx/sites-enabled/`. If the symlink does not exist, Nginx will ignore a website's configuration.
- You can disable/enable any website by deleting/creating a symlink to its configuration file.

### Disable Nginx default homepage

```bash
sudo rm /etc/nginx/sites-enabled/default
```

### Enable Nginx default homepage

```bash
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```

## Test Nginx Configuration

```bash
sudo nginx -t
```

## Reload Nginx

```bash
sudo systemctl reload nginx
```

- Reloads configuration without stopping the Nginx process — useful when only configuration files are updated.

## Restart Nginx

```bash
sudo systemctl restart nginx
```

- Completely stops and starts Nginx process — needed when installing new modules.

## Disable / Enable Nginx Automatic Start

```bash
sudo systemctl disable nginx
```

- Prevents Nginx from automatic start at boot time.

```bash
sudo systemctl enable nginx
```

- Enables Nginx to start automatically at boot time.

## Related

- [Nginx configuration](/notes/Linux/nginx-configuration.md)