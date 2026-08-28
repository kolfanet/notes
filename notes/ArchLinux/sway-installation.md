## Summary

Minimal Sway installation on ArchLinux.

## Update the system

```bash
sudo pacman -Syu
```
## Install Sway and basic tools

```bash
sudo pacman -S sway foot intel-ucode vulkan-intel intel-media-driver
```

- `sway` - the compositor/window manager
- `foot` - lightweight Wayland terminal
- `intel-ucode` - Intel CPU microcode updates
- `vulkan-intel` - Intel Vulkan driver
- `intel-media-driver` - hardware video acceleration

## Configuration

Copy default config:

```bash
mkdir -p ~/.config/sway
cp /etc/sway/config ~/.config/sway/config
```

Read the default config - it has comments that explain what each option does. Read `man 5 sway` for more information about each config command:

```bash
nano ~/.config/sway/config
```

## Start Sway (no login manager)

After login in tty run:

```bash
exec dbus-run-session sway
```

You can automate this in `.bash_profile`:

```bash
nano ~/.bash_profile
```
With confirmation:

```bash
# Auto-launch Sway on TTY1 login
if [ "$(tty)" = "/dev/tty1" ]; then
    read -p "Start Sway? [y]es or [n]o: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        exec dbus-run-session sway
    fi
fi
```

Without confirmation:

```bash
# If running from tty1 start sway
[ "$(tty)" = "/dev/tty1" ] && exec dbus-run-session sway
```

## Reboot

```bash
reboot
```

## First launch - basics

Useful shortcuts:

- `Super + Enter` - open terminal
- `Super + Shift + E` - exit sway
- `Super + Shift + Q` - close window
- `Super + 1..9` - switch workspace

## Other packages

- `waybar` - top bar
- `wofi` - application launcher
- `swaybg` - wallpaper utility