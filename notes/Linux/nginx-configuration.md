## Summary

A few notes on Nginx configuration.

**Prerequisites:**

- [Nginx installation](/notes/Linux/nginx-installation.md)

## Sources

- [Ubuntu server documentation](https://documentation.ubuntu.com/server/how-to/web-services/configure-nginx/)

## Create Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/myconfig
```

```text
server {
 listen 80;
 listen [::]:80;
 root /path-to-source-directory;
 index index.html;
 server_name example.com www.example.com;

 location / {
 try_files $uri $uri/ =404;
 }
}
```

- Replace `path-to-source-directory` with relevant path (e.g. the output directory of your 11ty project).

## Forward to Naked Domain

```text
# 1) Redirect www → apex on HTTP
server {
 listen 80;
 listen [::]:80;
 server_name www.example.com;
 return 301 http://example.com$request_uri;
}

# 2) Serve the site on the apex
server {
 listen 80;
 listen [::]:80;
 server_name example.com;
 root /var/www/website/dist;
 index index.html;

 location / {
 try_files $uri $uri/ =404;
 }
}
```

## Update DNS settings

- Create A record with name `@` and value `your_server_ip`
- Create CNAME record with name `www` and value `example.com`

## Symlink - Nginx configuration

```bash
sudo ln -s /etc/nginx/sites-available/mywebsite.conf /etc/nginx/sites-enabled/
```

## Remove symlink for Nginx default configuration

```bash
sudo rm /etc/nginx/sites-enabled/default
```

## Test Nginx configuration

```bash
sudo nginx -t
```

## Reload Nginx

```bash
sudo systemctl reload nginx
```

## Visit the website

- Navigate to your website in browser: http://my-site.org or http://www.my-site.org
- Make sure you use `http` (not `https`) as this configuration supports unsecured connection only

## Related

- [SSL certificate](/notes/Linux/ssl-certificate.md)