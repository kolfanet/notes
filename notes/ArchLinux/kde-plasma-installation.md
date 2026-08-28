## Install KDE Plasma

```bash
sudo pacman -S plasma kde-applications
```

- for minimal setup `kde-applications` can be left out

During the installation:

- press `enter` for group plasma
- press `enter` for group kde applications
- choose `qt6-multimedia-ffmpeg` for `qt6-multimedia-backend`
- choose `pipewire-jack` for `jack`
- choose `noto-fonts` for `ttf-font`
- choose `pyside6` for `qt6-python-bindings`
- choose `cronie` for `cron`

## Install display manager

```bash
sudo pacman -S sddm
```

```bash
sudo systemctl enable sddm
```

## Install audio packages

```bash
sudo pacman -S pipewire pipewire-alsa pipewire-pulse wireplumber
```

## Reboot

```bash
reboot
```

## After KDE login

```bash
sudo pacman -S firefox ark unzip unrar 
```

It installs:
- browser
- archive tools