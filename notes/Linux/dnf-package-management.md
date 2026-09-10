## Summary

A few notes about DNF package management on Fedora.

## Refresh package metadata

```bash
sudo dnf makecache --refresh
```

**Note:**

- Refreshes repository metadata and creates/updates the local package metadata cache.
- Usually, you don't need to run this separately before upgrading. `dnf upgrade --refresh` does both in one command.

## Upgrade DNF packages

### List available package upgrades

```bash
dnf check-upgrade
```

**Note:**

- Lists installed packages for which newer versions are available.
- Does not install the upgrades.

### Upgrade packages

```bash
sudo dnf upgrade
```

**Note:**

- Upgrades installed packages to the newest versions available from the currently cached repository metadata.
- DNF automatically resolves dependencies required by the upgrade.

### Refresh metadata and upgrade packages

```bash
sudo dnf upgrade --refresh
```

**Note:**

- Refreshes repository metadata before upgrading packages.
- This is a good command to use for a normal manual system update.

## Search, show and list packages

### Search

```bash
dnf search <search-term>
```

**Note:**

- Searches available package names and summaries/descriptions for the given term.

### List packages

```bash
dnf list <package-name>
```

**Note:**

- Shows matching packages and whether they are installed or available from configured repositories.

### Show full details

```bash
dnf info <package-name>
```

**Note:**

- Shows detailed package information such as version, architecture, repository, size, license and description.

## Install packages

### Default installation

```bash
sudo dnf install <package-name>
```

**Note:**

- Installs the requested package together with the dependencies required by it.
- DNF automatically resolves the dependency tree.

### Install without weak dependencies

```bash
sudo dnf install <package-name> --setopt=install_weak_deps=False
```

**Note:**

- Installs required dependencies but skips weak dependencies such as recommended or suggested packages.

## Reinstall packages

```bash
sudo dnf reinstall <package-name>
```

**Note:**

- Reinstalls an already installed package.
- Useful when package-owned files have been accidentally removed or corrupted.

## Remove packages

```bash
sudo dnf remove <package-name>
```

**Note:**

- Removes the specified package.
- DNF may also remove dependencies that were installed automatically and are no longer required by other packages.
- Configuration files created or modified while using the application are not necessarily removed.

### Autoremove dependencies

```bash
sudo dnf autoremove
```

**Note:**

- Removes packages that were originally installed as dependencies but are no longer required.

## Useful package queries

### List installed packages

```bash
dnf list --installed
```

### Check whether a package is installed

```bash
dnf list --installed <package-name>
```

### Find which package provides a file or command

```bash
dnf provides <file-or-command>
```

For example:

```bash
dnf provides '*/ffmpeg'
```

### Show package dependencies

```bash
dnf repoquery --requires <package-name>
```

## Common system update

For routine Fedora maintenance, the main command to remember is:

```bash
sudo dnf upgrade --refresh
```

Optionally, remove dependencies that are no longer needed afterwards:

```bash
sudo dnf autoremove
```