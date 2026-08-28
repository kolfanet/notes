## Summary

A few notes about snap package management.

## Snap service

### Install snap service (if not installed)

```bash
sudo apt install snapd
```

### Enable & start the service

```bash
sudo systemctl enable snapd
sudo systemctl start snapd
sudo reboot
```

## Search snap packages

```bash
snap find <search-term>
```

## List installed snap packages

```bash
snap list
```

## Install snap packages (sandboxed)

```bash
sudo snap install <package-name>
```

**Note:**

- It also installs runtime snaps (if needed by the package)
  - `Base snaps` — minimal Linux filesystem the package needs (libraries, certificates, etc.)
  - `Content snaps` — shared libraries (audio/video stacks, GNOME libraries, etc.)

## Install snap packages (not sandboxed)

Some snaps do not run inside the sandbox (created by snap) but in classic confinement (full access to the system). Such packages can be installed as follows:

```bash
sudo snap install <package-name> --classic
```

## Update snap package

```bash
sudo snap refresh <package-name>
```

## Remove snap package

```bash
sudo snap remove <package-name>
```

**Note:**

- This does not remove runtime snaps that were installed with the package (see connections below)
- It creates a snapshot with user data (see snapshots below)

## List snap package connections

```bash
snap connections <package-name>
```

**Note:**

- You can remove those provided no other snap package needs them

## List snapshots of removed packages

```bash
snap saved
```

**Note:**

- You can delete a specific snapshot by specifying its ID:

```bash
sudo snap forget <id>
```

## Package binary location

```bash
which <package-name>
```

**Note:**

- Returns `/snap/bin/<package-name>` if installed with `snap`
- Returns `/usr/bin/<package-name>` if installed with `apt`
- You can run the package by executing its binary