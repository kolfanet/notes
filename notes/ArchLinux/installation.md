## Summary

ArchLinux installation.

## Create Installation USB

- https://archlinux.org/download/
- archlinux-YYYY.MM.DD-x86_64.iso
- verify the ISO image (check it against `sha256sums.txt`)
	- on mac: `shasum -a 256 archlinux-YYYY.MM.DD-x86_64.iso`
- create bootable USB with [balenaEtcher](https://etcher.balena.io)
- boot from USB and choose `Arch Linux Install medium`

## Verify the boot mode

```bash
cat /sys/firmware/efi/fw_platform_size
```

- If the command returns `64`, the system is booted in UEFI mode and has a 64-bit x64 UEFI.

## Set the console keymap

```bash
localectl list-keymaps # list available layouts
```

```bash
loadkeys cz
```

## Connect to the internet

```bash
ip link # check the current connection
```

## Update the system clock

```bash
timedatectl
```

## Partition the disk

```bash
fdisk /dev/the_disk_to_be_partitioned # e.g. nvme1n1
```

### Delete existing partitions

- press `d` and select the partition to be deleted
- repeat until all partitions are removed

### Create new EFI partition

- press `n`
	- partition number: `1`
	- first sector: `Enter`
	- last sector: `+1G`
- press `t`
	- partition number: `1`
	- partition type or alias: `1` (i.e. EFI System)

Note: if asked whether to remove a vfat signature, press `y`.

### Create Swap partition

- press `n`
	- partition number: `2`
	- first sector: `Enter`
	- last sector: `+16G`
- press `t`
	- partition number: `2`
	- partition type or alias: `19` (i.e. Linux swap)

### Create Root partition

- press `n`
	- partition number: `3`
	- first sector: `Enter`
	- last sector: `Enter` (i.e. it will take up the rest of the disk)

### Save the partition table

- press `w` and confirm

### Check your partitioning

```bash
lsblk
```

## Format the partitions

```bash
mkfs.fat -F32 /dev/efi_system_partition. # e.g. nvme1n1p1
```

```bash
mkswap /dev/swap_partition # e.g. nvme1n1p2
```

```bash
mkfs.ext4 /dev/root_partition # e.g. nvme1n1p3
```

## Mount the filesystems

```bash
mount /dev/root_partition /mnt # e.g. nvme1n1p3
```

```bash
mount --mkdir /dev/efi_system_partition /mnt/boot # e.g. nvme1n1p1
```

```bash
swapon /dev/swap_partition # e.g. nvme1n1p2
```

## Install the base system

```bash
pacstrap -K /mnt base linux linux-firmware nano networkmanager
```

It installs:
- base Arch system
- Linux kernel
- firmware
- Nano editor
- NetworkManager

## Generate `fstab`

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

Check:

```bash
cat /mnt/etc/fstab
```

It should contain entries for:
- `/`
- `boot`
- `swap`

## Enter the new system

```bash
arch-chroot /mnt
```

## Set the timezone

```bash
ln -sf /usr/share/zoneinfo/Europe/Prague /etc/localtime
```

Generate the hardware clock:

```bash
hwclock --systohc
```

## Configure Locale

```bash
nano /etc/locale.gen
```

- uncomment `en_US.UTF-8 UTF-8`

Then generate the locales:

```bash
locale-gen
```

Create the locale configuration file:

```bash
echo "LANG=en_US.UTF-8" > /etc/locale.conf
```

Persist your keyboard layout:

```bash
echo "KEYMAP=cz" > /etc/vconsole.conf
```

## Set hostname

```bash
echo "archlinux" > /etc/hostname
```

## Set root password

```bash
passwd
```

Then enter your root password.

## Enable NetworkManager

```bash
systemctl enable NetworkManager
```

## Recreate your `initramfs`

```bash
mkinitcpio -P
```

## Install bootloader

Install GRUB packages:

```bash
pacman -S grub efibootmgr
```

Install GRUB to your Arch EFI partition (mounted as `/boot`):

```bash
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=Arch
```

This will create a new UEFI entry called `Arch`

Generate GRUB configuration:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

## Final step

```bash
exit
```

Unmount everything:

```bash
umount -R /mnt
```

Reboot:

```bash
reboot
```