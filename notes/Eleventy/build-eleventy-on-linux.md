## Summary

How to clone an Eleventy repo from GitHub and build it on a Linux server.

**Prerequisite:**

- [Node.js installation](/notes/Installation-Guides/nodejs-installation.md) on the server.

## Create a working directory

```bash
sudo mkdir -p /var/www/website
sudo chown -R <user>:<group> /var/www/website
```

- Replace `<user>` and `<group>` with your username and group name.

## Clone 11ty repo to a server

### For Github

```bash
cd /var/www/website
git clone git@github.com:<username>/<repository_name>.git .
```

### For Codeberg

```bash
cd /var/www/website
git clone ssh://git@codeberg.org:<username>/<repository_name>.git .
```

- Replace `<username>` and `<repository_name>`.
- The command above assumes you clone the repo via SSH (i.e. SSH keys were generated and the public key was added to your GitHub account).

## Install dependencies and build

```bash
cd /var/www/website
npm ci || npm install
npm run build
```

- Installs dependencies exactly as locked in `package-lock.json` (if available). Otherwise `npm install` installs dependencies from `package.json`.
- 11ty is built into the output folder, e.g. `/var/www/website/dist` (depending on the 11ty configuration file).

## Future updates

```bash
cd /var/www/website
git pull origin main
npm install
rm -rf dist
npm run build
```

## Related

- [Nginx installation](/notes/Linux/nginx-installation.md)
- [Nginx configuration](/notes/Linux/nginx-configuration.md)
- [SSL certificate](/notes/Linux/ssl-certificate.md)
