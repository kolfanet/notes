# Create Script File

```bash
nano ~/myscript.sh
```

# Make the Script Executable

```bash
chmod +x ~/myscript.sh
```
which marks the file as executable.

# Execute Script

Simply call script path to the file and the filename.

```bash
~/myscript.sh
```

# Script Structure

## Shebang or hash bang

First line in the script which defines the interpreter the kernel should use. 

```bash
#!/bin/bash
```

```bash
#!/usr/bin/python
```

## If Statement

```bash
#!/bin/bash
# install apache if it is not installed already
if [ ! -f /usr/sbin/apache2 ]; then
	sudo apt install -y apache2
fi
```
where
- `if` - the beginning of if statement
- `[ ... ]` - container for a condition
-  `[ ! ...]` - exclamation mark is an inverse
- `-f` - we are looking for a file (`-d` would be directory)
- `fi` - the end of if statement

## If / Else Blocks & Operators

```bash
#!/bin/bash
myVar=10
if [ myVar -eq 1 ]; then
	echo "The variable equals 1"
else
	echo " The variable does not equal 1"
fi
```
where
- `else` - defines alternative workflow
- `-eg` - equal to
- `-ne` - not equal
- `-gt` - greater than
- `-ge` - greater or equal
- `lt` - less than

## While Loop

```bash
#!/bin/bash
myVar=1
while [ myVar -le 15 ]
do
	echo $myVar
	((myVar++))
done
```
where
`(( ... ))` - tells interpreter we're doing arithmetic operation

## For Loop

```bash
#!/bin/bash
list="Fanda Maja Veru Fanousek"
for item in $list 
do
echo $item
done
```

## rsync Backup Script

### Original Command

```bash
rsync -avb --delete --backup-dir=/backup/incremental/08-17-2022 /src /target
```
where
-`rsync` - copies data from one place to another
- `-a` - archive option - retains metadata of the files it copies to target (e.g. timestamp, owner)
- `-v` - option that gives verbose output so we can see what rsync is doing
- `-b` - backup mode - if file on target is overwritten by a file from source it , the previous version of the file will be renamed so that it is not overwritten
- `--delete` - delete any files in target that are not in source (due to `-b` it will be retained)
- `--backup-dir` - any time file is deleted or renamed, it will be copied to another directory

### Final Script

```bash
#!/bin/bash
curDate=$(date +%m-%d-%Y)
if [ ! -f /usr/bin/rsync ]; then
	sudo apt install -y rsync
fi
rsync -avb --delete --backup-dir=/backup/incremental/$curdate /src /target
```