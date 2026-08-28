## Apple Magic Mouse

### Install required packages

```bash
sudo pacman -S bluez bluez-utils bluedevil
```

### Enable Bluetooth service

```bash
sudo systemctl enable bluetooth
sudo systemctl start bluetooth
```

### Pair in KDE Plasma settings

Requires [KDE Plasma](/notes/ArchLinux/kde-plasma-installation.md).

1. Open **System Settings → Bluetooth**
2. Turn Bluetooth ON
3. Turn on your Magic Mouse
4. Click _Pair_

## WiFi

### Check WiFi drivers

```bash
lspci -k | grep -A 3 -i network
ip link
lsmod | grep wl
```
### Install the correct driver

```bash
sudo pacman -S broadcom-wl
```

### Blacklist the wrong modules

```bash
sudo nano /etc/modprobe.d/blacklist-broadcom.conf
```

```text
blacklist bcma
blacklist b43
blacklist brcmsmac
blacklist ssb
```

```bash
reboot
```

### WiFi disappears after update

```bash
sudo pacman -S broadcom-wl
sudo reboot
```