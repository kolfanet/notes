# Copy Files & Directories

## Copy Files

```bash
cp file1 file2
```
which creates a file2 as an exact copy of file1.

```bash
cp file1 .
```
which creates a copy of file1 in current working directory
- period represents current working directory

## Copy Directories

```bash
cp -r dir1 .
```
which creates a local copy of dir1 (including its content) in current working directory.

# Move Files & Directories

##  Move Files

```bash
mv <path1> <path2>
```
which moves file from path1 into new location at path2

## Move Directories

```bash
mv dir1 dir2 path
```
which moves multiple directories into path (works for `cp` as well)

# Rename Files

```bash
mv file1 file2
```
which renames file1 to file2
- it  moves file1 from current working directory into the same directory and stores with different name

# Editing Files

## Nano Editor

```bash
nano <file>
```
which opens given file in nano editor. Without specifying any file, the blank document is opened.

## Vim Editor

Vim editor is not installed by default. There are various Vim editors that can be installed, e.g. vim-nox which has a built-in support for scripting languages.

```bash
sudo apt install vim-nox
```

```bash
vim file
```
which open a file in Vim editor. Without specifying any file, the blank document is opened.

### Command Mode

The command mode is active by default when you start Vim editor.

`x` - deletes a single character wherever the cursor is
`d + d` - deletes an entire line + copies that line into paste buffer
`p` - paste whatever is copied
`A` - enters into insert mode and places cursor at the end of current line
`shift + g` - go to the end of the file
`g + g` - go to the top of the file
`:set numbers` - displays line numbers
`:set nonumbers` - disables line numbers

### Insert Mode

Can be switched to by pressing `i` letter key. To exit insert mode, press `Esc`.

### Visual Mode

Can be switched to by pressing `v` letter key. To exit insert mode, press `Esc`. Visual mode allows you to select text.

- `y` - copy selected text
- `p` - paste copied text
-  `u` - undo pasting

## Quit Vim Editor

### Quit - No Changes Made

```bash
:q
```

### Changes Made & Ignored - Force Quit

```bash
:q!
```

### Changes Made  &  Stored

```bash
:wq
```

##  Run shell commands in Vim

```bash
:! <shell command>
```
which runs any shell command that is provided after the exclamation mark.

## Split Window - Multiple Files

```bash
:sp file1
```
which opens second file next to already opened document in the same window (horizontal split).

```bash
:vs file1
```
which splits the screen vertically

- `Ctrl + W + W` - switch between the windows
- `:q` - quit individual window 

## Vim Configuration

```bash
vim ~/.vimcr
```
which opens vim config file.
- e.g. insert text `set numbers` to enable line numbers by default

# Background / Foreground the editor

You can make the editor disappear (background) and then bring it back (foreground). - -- You can background it by pressing `Ctrl + t + z`.
- You can froeground it by running `fg` command

# Input / Output / Error Streams

Input streams are referred to as Standard Input (`stdin`) and Output streams as Standard Output (`stdout`). The third stream is Errors (`stderr`).

File descriptors:
- `0` - standard input
- `1` - standard output
- `2` - errors

## Stream Redirection

### Standard Output

```bash
cat /var/log/syslog > ~/logfile.txt
```
which redirects Standard Output of `cat` command to specified file. It overwrites the file. 

```bash
cat /var/log/syslog >> ~/logfile.txt
```
which redirects Standard Output of `cat` command to specified file. It appends the file.

### Standard Input

```bash
cat < /var/log/syslog | grep Network
```
which redirects the content of `/var/log/syslog` to be Standard Input to the `cat` command.

### Errors

```bash
find / -name "syslog"
```
which under normal conditions returns a number of error due to not having a permission to read all files on the filesystem. 

However we redirect those errors:

```bash
find / -name "syslog" 2> /dev/null
```
where
- `2` - a file descriptor for errors
- `>` - redirects 
- `/dev/null` - special device where things get deleted

### Multiple Redirection

```bash
find / -name "syslog" 1> stdout.txt 2> stderr.txt
```

# Symbolic / Hard Link

## inodes
An inode is a data object that contains metadata regarding files within out filesystem. inode can be displayed as follows:

```bash
ls -i
```

## Hard Link

```bash
ln file1 file2
```
which creates a hard link (`file2`) that is linked to `file1`. From now on `file2` has the same inode, i.e. it is a duplicate directory entry. Both entries now point to the same data.
- `file1` can be moved anywhere on filesystem, the link will still be there
- hard link cannot be created to directory, only to a file
- link cannot be moved to a different filesystem (as that system has different set of inodes)

## Symbolic Link (Symlink)

```bash
ln -s file1 file2
```
which creates symlink (`file2`) that is linked to `file1`. The files will have different inodes. Instead of being a clone of original file, symlink is rather pointer to the original file path.
- any commands executed against symlink are being run against the target that the link is pointing to.
- hard link points to the file, symlink points to the file path
- if you move original file, symlink will not work