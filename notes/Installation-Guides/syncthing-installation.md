## Summary

Sync between Arch Linux and MacBook Pro through an Ubuntu server using [Syncthing](https://syncthing.net/).

## Install Syncthing on the Ubuntu server

### Installation

```sh
sudo mkdir -p /etc/apt/keyrings
sudo curl -L -o /etc/apt/keyrings/syncthing-archive-keyring.gpg https://syncthing.net/release-key.gpg
echo "deb [signed-by=/etc/apt/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable-v2" | sudo tee /etc/apt/sources.list.d/syncthing.list
sudo apt update
sudo apt install syncthing
```

### Create folder for Syncthing

```sh
mkdir -p ~/path/to/folder
```

### Make Syncthing start automatically

#### Enable & start the user service

```sh
systemctl --user enable syncthing.service
systemctl --user start syncthing.service
```

#### Make Syncthing start at boot (even without login)

```sh
sudo loginctl enable-linger youruser
```

**Note:**

- Replace `youruser`

#### Check the status

```sh
systemctl --user status syncthing.service
```

#### View logs if needed

```sh
journalctl -e --user-unit=syncthing.service
```

### Open Syncthing web interface on the server

For a headless server, use SSH port forwarding from another computer:

```sh
ssh -L 8385:127.0.0.1:8384 youruser@server-ip
```

What it does:

- Opens port `8385` on your local machine  
- Forwards it to `127.0.0.1:8384` on the server  
- Lets you access the remote service via: `http://localhost:8384`

**Note:**

- On first launch, Syncthing creates config files, keys, and a default folder automatically

## Install Syncthing on Mac

### Installation (with brew)

```sh
brew install syncthing
```

### Run it manually (once)

```sh
syncthing
```

### Open Syncthing web interface on Mac

```sh
http://127.0.0.1:8384
```

### Enable it as a service

#### Stop Syncthing

Press `Ctrl + C` in terminal

#### Enable it as a service

```sh
brew services start syncthing
```

#### Check the status

```sh
brew services list
```

It should say something like `Successfully started syncthing...`. Syncthing will now start automatically every time your Mac boots.

## Install Syncthing on Arch Linux

### Installation

```sh
sudo pacman -S syncthing
```

### Start it once

```sh
syncthing
```

### Open Syncthing web interface on Arch Linux

```sh
http://127.0.0.1:8384
```

### Make Syncthing start automatically

#### Enable & start the user service

```sh
systemctl --user enable syncthing.service
systemctl --user start syncthing.service
```

#### Check the status

```sh
systemctl --user status syncthing.service
```

## Get the Device IDs

On each of the three machines:

- Open the Syncthing GUI  
- Open the top-right actions/gear menu  
- Show the Device ID  

## Add the devices

### First on the Ubuntu server

Add two remote devices (Mac & Arch Linux):

- Click `Add Remote Device`  
- Paste its Device ID  
- Give it a name like MacBook or ArchLinux  
- Save  

The Mac and Arch machines should each show a prompt asking whether to add the Ubuntu server. Accept both prompts.

#### On the Mac & Arch Linux (if needed)

If necessary, add the Ubuntu server manually on both machines.

## Create the folder on the Ubuntu server and share it

In the Ubuntu server’s Syncthing GUI:

- Click **Add Folder**  
- Set a label (e.g. `SharedDocs`)  
- Leave the auto-generated Folder ID  
- Set Folder Path (e.g. `~/path/to/folder`)  
- In the sharing section, choose:
  - Mac  
  - ArchLinux  
- Save  

## Accept the shared folder

Both machines should show a prompt that the Ubuntu server wants to share a folder. On both machines:

- Click **Add**  
- Choose the folder path  
- Save  

## Test it

Create a small text file on the Mac inside the shared folder. It should appear on both the Ubuntu server and Arch Linux.

## Further modifications

### Turn on versioning

By default, Syncthing syncs deletions too, so deleting a file on one device propagates everywhere.

Syncthing supports per-folder file versioning. “Simple File Versioning” stores replaced or deleted files in `.stversions`.

On the Ubuntu server only:

- Open folder settings for `SharedDocs`  
- Find **File Versioning**  
- Choose **Simple File Versioning**  
- Set a number like `10` or `20`  

This way, the server keeps old copies if something is deleted or overwritten from another machine. Versioning is configured per folder, per device.