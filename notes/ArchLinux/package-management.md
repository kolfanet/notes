## pacman

### Install package

```bash
pacman -S firefox
```

### Remove package

```bash
pacman -R package-name
```

### Remove package (unused dependencies)

```bash
pacman -Rs package-name
```

### Remove everything (including config files)

```bash
pacman -Rns package-name
```

### Update everything

```bash
pacman -Syu
```

### Get info about installed package

```bash
pacman -Si firefox
```

### Search in repo (not yet installed)

```bash
pacman -Ss keyword 
```

### Search Installed packages 

```bash
pacman -Qs keyword
```

### List all installed packages

```bash
pacman -Q
```

### List all manually installed packages

```bash
pacman -Qe
```


## yay

Prerequisites: [yay is installed](/notes/ArchLinux/yay-installation.md).

### Install package

```bash
yay -S visual-studio-code-bin
```

### List all installed packages (AUR)

```bash
yay -Qm
```

### Search in repos (pacman & AUR)

```bash
yay package-name
```

### Search official pacman repo only 

```bash
yay -Ss firefox --repo
```

### Search AUR packages only 

```bash
yay -Ss firefox --aur
```

### Update everything (pacman + AUR):

```bash
yay -Syu
```