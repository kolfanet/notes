# Linux Shell

The shell program is responsible for reading user's command and having the Linux Kernel execute them.
- Bash (Bourne Again Shell)
- Zsh
- Fish
- ksh

# Bash History

History is stored in `~/.bash_history` and configuration in `~/.bashrc`

# View History
```bash
history
```

# Execute Command from History
```bash
!123
```

# Delete Command from History

```bash
history -d 123
```

# Do not Save a Command in History

```bash
 sudo apt update
```
How: you need to make a space before actual command.

# Command Line Tricks

## Execute Last Command
```bash
!!
```

## Tab Completion
- Press `Tab` on your keyboard to autocomplete what you type (if feasible). 
- Press `Tab` twice to see a complete list of autocomplete options

## Keyboard Shortcuts

| Shortcut     | Result                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| Ctrl + a     | Moves the cursor to the beginning of the line                                                             |
| Ctrl + e     | Moves the cursor to the end of the line                                                                   |
| Ctrl + l     | Clears the screen                                                                                         |
| Ctrl + k     | Deletes characters from the cursor to the end of the line                                                 |
| Ctrl + u     | Deletes everything on the line (works also for password text)                                             |
| Ctrl + w     | Deletes the word to the left of the cursor                                                                |
| Ctrl + r     | Initiates a search and makes proposal based on typing (press it repeatedly to browse through all options) |
| Ctrl + x + e | The current command will open in a text editor.                                                           |

## Chaining Commands

```bash
sudo apt update && sudo apt install nginx 
```
which executes second command only if the first successfully finishes

```bash
sudo apt update; sudo apt install nginx
```
which executes second command regardless of whether the first command was successful

## Command Exit Code

```bash
echo $?
```
which returns `0` for successful command. Anything else means error.

## Aliases

```bash
alias install="sudo apt install"
```
which enables you to run `install nginx`

- aliases are wiped out once you exit terminal window
- you can make them permanent by putting them in `.bashrc`

# Variables

## Define Variable 

```bash
myVar="hovno"
```
which defines variable `myVar`

## Display Variable

```bash
echo $myVar
```

## Capture Input into Variable

```bash
echo "Enter your age" && read age && echo "Your age is $age"
```
where
- `read` - it actually read an input and store it into `age` variable