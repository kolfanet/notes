## Summary

A few notes about Advance Packaging Tool (APT).

## Sources

- [Official documentation](https://ubuntu.com/server/docs/tutorial/managing-software/#updating-the-system-with-apt)

## Update APT database

```bash
sudo apt update
```

**Note:**

- Updates the APT database with the newest packages' metadata.

## Upgrade APT packages

### List upgradable packages

```bash
apt list --upgradable
```

### Upgrade packages

```bash
sudo apt upgrade
```

**Note:**

- Upgrades only packages without dependency issues.

### Upgrade and resolve conflicts

```bash
sudo apt dist-upgrade
```

**Note:**

- Resolves conflicts between package versions (e.g. installs new dependencies or removes old conflicting packages).

## Search, show and list packages

### Search

```bash
apt search <search-term>
```

**Note:**

- Returns the list of packages that match the given term (in name and/or description).

### Show quick details

```bash
apt list <package-name>
```

### Show full details

```bash
apt show <package-name>
```

## Install packages

### Default installation

```bash
sudo apt install <package-name>
```

**Note:**

- Installs the package itself including its dependencies and recommended packages.

### Install without recommended packages

```bash
sudo apt install <package-name> --no-install-recommends
```

### Install with suggested packages

```bash
sudo apt install <package-name> --install-suggests
```

## Reinstall packages

```bash
sudo apt install --reinstall <package-name>
```

**Note:**

- Reinstalls the package (overwrites package files except for configuration files).

## Remove packages

```bash
sudo apt remove <package-name>
```

**Note:**

- Removes the package but not other dependencies the package needed.
- Does not remove configuration files.

### Remove package including configuration files

```bash
sudo apt remove --purge <package-name>
```

### Autoremove dependencies

```bash
sudo apt autoremove
```

**Note:**

- Removes packages flagged for automatic removal (the original reason for the package to be installed no longer exists).
- You can unflag a package from automatic removal by reinstalling it manually.