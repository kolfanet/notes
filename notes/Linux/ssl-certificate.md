## Summary

How to obtain and install an SSL certificate using `Certbot` on an Ubuntu server.

**Prerequisites:**

- [Nginx installation](/notes/Linux/nginx-installation.md)  
- [Nginx configuration](/notes/Linux/nginx-configuration.md) for the given domain exists

## Install Certbot and Nginx plugin

```bash
sudo apt install certbot python3-certbot-nginx
```

## Obtain and Install SSL Certificate

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

- Installs and stores certificates and related configuration in `/etc/letsencrypt`
- Updates corresponding Nginx configuration

To obtain just the certificate without updating Nginx configuration:

```bash
sudo certbot certonly --nginx -d example.social
```

## Test Nginx configuration

```bash
sudo nginx -t
```

## Restart Nginx

```bash
sudo systemctl restart nginx
```

## List certificates managed by Certbot

```bash
sudo certbot certificates
```

## Delete Certbot certificate

```bash
sudo certbot delete --cert-name example.com
```
