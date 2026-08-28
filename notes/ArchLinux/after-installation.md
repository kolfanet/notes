## Prerequisites

- [ArchLinux is installed](/notes/ArchLinux/installation.md)

## Create normal user

Login as root.

```bash
useradd -m -G wheel -s /bin/bash <username>
```

Set password:

```bash
passwd <username>
```

## Install sudo

```bash
pacman -S sudo
```

## Allow wheel group to use sudo

```bash
EDITOR=nano visudo
```

- uncomment `%wheel ALL=(ALL:ALL) ALL`, store and exit

## Update the system

```bash
pacman -Syu
```