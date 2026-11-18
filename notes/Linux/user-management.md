# View Users

## /etc/passwd

```bash
cat /etc/passwd
```

- each line corresponds to one user
- info in columns that are separated by `:`

	- column 1: `username`
	- column 2: `x` (= password is encrypted and stored in `/etc/passwd`)
	- column 3: `UID` (user id)
	- column 4: `GID` (group id)
	- column 5: `First & Last Name` (note: column is nicknamed to `GECOS`)
	- column 6: `home directory`
	- column 7: `user's shell` (e.g. `/bin/bash`)

Note:

- You can run `man passwd` for more details
- User's shell defaults to `/bin/bash` if created with the `adduser` and to `/bin/sh` if created with `useradd`
- `/etc/passwd` is visible to everybody
- Changing user's shell to something invalid prevents that user from logging in

## /etc/shadow


```bash
sudo cat /etc/shadow
```

- each line corresponds to one user
- info in columns that are separated by `:`
	- column 1: `username`
	- column 2: `password hash` (if `*` then no hash, the user is locked out, e.g. `root`)
	- column 3: `date` (date of last password change)
	- column 4: `minimum number of days` (before next password change is allowed)
	- column 5: `maximum number of days` (between password changes)
	- column 6: `number of days` (before the password expiration, user is warned)
	- column 7: `number of days` (after the password expiration when when an account is disabled)
	- column 8: `number of days` (till the account is disabled, empty inless disabled day is set)

Note:

- You can run `man shadow` for more details
- `/etc/shadow` is visible to users with `root` privileges

# Create User

## useradd

```bash
sudo useradd -d /home/testuser -m testuser
```

where

- `-d` - creates user's home directory
- `/home/testuser` - specifies user's home directory
- `-m` - creates user's home directory automatically
- `testuser` - specifies username

## adduser

More convenient compared to`useradd` but not available in all distributions.

```bash
sudo adduser testuser2
```

## New User's Default Content

Files that are contained in `/etc/skel` are copied into the home directory for all new users. 

```bash
ls -la /etc/skel 
```

where
- `la` - displays also hidden files in this folder

# Delete User

## Delete User & Keep Home Directory

```bash
sudo userdel testuser2
```

## Delete User and their Home Directory
```bash
sudo userdel -r testuser2
```

# User's Password

## Set User's Password

```bash
sudo passwd testuser
```

## Lock Out User

```bash
suddo passwd -l username 
```

which places ! before password hash in /etc/passwd. 
- user cannot login
- user can still access the server via SSH login (if available for them)
- user cannot run sudo commands as his password is not valid

## Unlock User

```bash
sudo passwd -u username
```

# Switch User

## Switch User without Sudo

```bash
su - username
```

and
- you will be asked for username's password to switch

## Switch User with Sudo

```bash
sudo su - username
```

and
- you will be asked for your own password to confirm root privileges

## Switch to ROOT user

```bash
sudo su - 
```

and
- you will be asked for your own password to confirm root privileges

# Groups

Every file or directory has both user and group that takes ownership of it (one-to-one ownership).

```bash
ls -l
```

where
- 3rd position is username 
- 4th position is group name 

## View All Groups
```bash
cat /etc/group
```

which returns list of all groups in the system with the following columns:

- group name
- password (not really used due to security risks)
- GID (group ID)
- list of users that are group members

## Create Group

```bash
sudo groupadd admins
```

## Delete Group

```bash
sudo groupdel admins 
```

# Modify User Account - usermod

## Add an User to the Secondary Group(s)

```bash
sudo usermod -aG admins userX 
```

where
- `-a` - append; add an user to the secondary group(s)
- `G` - list of supplementary groups

## Change User's Primary Group

```bash
sudo usermod -g groupname username
```

## Change User's Home Directory 

```bash
sudo usermod -d /home/frank2 frank1 -m # changes home directory for frank1 to /home/frank2
```

which 
- changes home directory for frank1 to /home/frank2

## Change User's Username

```bash
sudo usermod -l frank2 frank1
```

which
- changes username for frank1 to frank2

## Remove an User from the Group

```bash
sudo gpasswd username groupname
```


# Manage Admin Access with sudo

## View User's with sudo Access

```bash
grep sudo /etc/group
```
which returns line(s) with word "sudo". The last field displays the members of this group.

## Add User into sudo Group

By default members for SUDO group can use `sudo` without any restrictions.

```bash
sudo usermod -aG sudo username 
```
 which adds username into sudo group

## Sudo Config - /etc/sudoers

```bash
sudo visudo 
```
which opens configuration file /etc/sudoers that governs sudo access

### Grand Sudo Access to an User

```bash
username ALL=(ALL:ALL) ALL 
```

### Grand Sudo Access to a Group

```bash
%groupname ALL=(ALL:ALL) ALL 
```

## Permission Structure

ALL=(ALL:ALL) ALL 

- 1st ALL - user can use sudo from any terminal
- 2nd ALL - user can impersonate any other user
- 3rd ALL - user can impersonate any other group
- 4th ALL - user can use all commands  

## Access to Specific Commands
```bash
frank ALL=(ALL:ALL) /sbin/reboot, /sbin/shutdown 
```

## Access to APT Commands
```bash
frank ALL= /usr/bin/apt 
```
User can execute apt commands, cannot impersonate any user/groul (ALL:ALL removed completely).

# Password Management

## View Password Information

```bash
sudo chage -l username 
```
which returns info from /etc/shadow in structured way

## Require Password change on Login

```bash
sudo chage -d 0 username
```
which sets number of days till password expiration to 0.

## Set Password's Validity

```bash
sudo chage -M 90 username 
```
which sets max number of days between password changes

## Prevent Frequent Password Update

```bash
sudo chage -m 5 username 
```
which sets min number of days between password changes.
  
## Password Policies - Pluggable Authentication Module (PAM)

```bash
sudo apt install libpam-cracklib
```

# File & Directories

## View Permissions 

```bash
ls -l 
```

returns permissions in first column where
- 1st charecter defines object type (`-` is file, `d` is directory, `l` is link)
- Then READ/WRITE/EXECUTE permissions follow for User, Group and Other (always set of three characters), e.g:
	- `rwx` Object has read, write and execute permission
	- `r-x` Object has read enabled, write disabled and execute enabled
	- `r--` Object has read enabled, write disabled and execute disabled
	- `---` Object has no permission enabled

## Change File Permissions

### Changing Specific Bits

```bash
sudo chmod o-r work.txt 
```
which removes bit "r" (read) from Other

```bash
sudo chmod g+r work.txt 
```
which adds bit "r" (read) to owning Group

```bash
sudo chmod o-rw work.txt 
```
which  removes bit "r" and "w" from Other

###  Octal Point Values

- read: `4`
- write: `2`
- execute: `1`

```bash
sudo chmod 640 work.txt
```

where
- Owning User gets R+W (4+2=6)
- Owning Group gets R (4)
- Other gets no permissions

## Change Directory Permissions

```bash
chmod 640 -R testfolder
```

where
- `R` applies changes also to all files and directories underneath the directory

## Changing the Ownership 

```bash
sudo chown username work.txt 
```
which  changes the ownership of file to username

```bash
sudo chown username:groupname work.txt 
```
which  changes the ownership of file to username and group name

```bash
sudo chown -R username testfolder 
```
which changes the ownership of testfolder and all its content to username

```bash
sudo chgrp sales file.txt 
```
which changes the ownership of file to group sales