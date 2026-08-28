## Summary

- **yay** makes it easy to install and manage software from the Arch User Repository (AUR)
- Instead of manually building packages, you can simply run: `yay -S package-name`
- **yay** searches both official repositories and AUR at once: `yay firefox`
- you can update both pacman packages and AUR packages together: `yay -Syu`

## Install required build tools

```bash
sudo pacman -S --needed git base-devel
```

- `git` → to download the build script
- `base-devel` → compilers and tools needed to build AUR packages

## Install yay

Clone the repository:

In your home directory:

```bash
git clone https://aur.archlinux.org/yay.git
```

Enter the directory:

```bash
cd yay
```

Build and install:

```bash
makepkg -si # -s installs dependencies, -i installs after building
```

Test it:

```bash
yay --version
```