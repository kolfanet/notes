# Mastodon — PostgreSQL Database Backup (Docker Compose)

- Installation: /opt/mastodon
- PostgreSQL container: mastodon-db-1
- Backup location: /opt/mastodon/backups/

# Navigate to Mastodon directory

```bash
cd /opt/mastodon
```

# Create the backup directory (if necessary)

```bash
sudo mkdir -p /opt/mastodon/backups
sudo chmod 700 /opt/mastodon/backups
```

# Create the database backup

```bash
sudo docker exec mastodon-db-1 \
  pg_dump -Fc \
  -U postgres \
  -d postgres \
  -f /tmp/mastodon-backup.dump
```
Wait for the command to finish.

# Verify the backup

Check its size:

```bash
sudo docker exec mastodon-db-1 \
  ls -lh /tmp/mastodon-backup.dump
```
Verify that the archive is readable:

```bash
sudo docker exec mastodon-db-1 \
  pg_restore --list /tmp/mastodon-backup.dump > /dev/null
```
The command should finish without errors.

# Copy the backup to the server

```bash
sudo docker cp \
  mastodon-db-1:/tmp/mastodon-backup.dump \
  /opt/mastodon/backups/mastodon-backup.dump
```

# Secure and verify the backup

```bash
sudo chmod 600 /opt/mastodon/backups/mastodon-backup.dump

sudo ls -lh /opt/mastodon/backups/mastodon-backup.dump
```

Optionally, verify that the copied file matches the original:

```bash
sudo docker exec mastodon-db-1 \
  sha256sum /tmp/mastodon-backup.dump

sudo sha256sum /opt/mastodon/backups/mastodon-backup.dump
```

The two checksums should be identical.

# Remove the temporary file

Once the backup has been copied and verified:

```bash
sudo docker exec mastodon-db-1 \
  rm /tmp/mastodon-backup.dump
```

# Exclude the backup directory from Git

```bash
cd /opt/mastodon
echo "/backups/" >> .git/info/exclude
```