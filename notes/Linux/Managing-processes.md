# Background Process

`Ctrl + z` - backgrounds process
`fg` - foregrounds process

## Display Backgrounded Processes
```bash
jobs
```

## Foreground Specific Job
```bash
fg 2
```

## Strat Process & Background It
```bash
nano &
```
which backgrounds the editor right away

# View Users' Processes

```bash
ps
```
which displays processes run by me

```bash
ps a
```
which displays the same processes but with additional information where
- `PID` - process ID
- `COMMAND` - actual command being run
- `STAT` - status code of the process 
		- `D` - uninterruptible sleep (waiting for input and cannot handle addtional signals)
		- `Z` - defunct (zombie process)
		- `T` - stopped (backgrounded)
		-  `S` - interruptible sleep (idle, waiting for the input to be awaken)
		-  `R` - in the run queue
- `TTY` - teletypewriter - on which terminal (`Ctrl + Alt + F1 .. F6`) or pseudo terminal (`pts`) the process runs
- `TIME` - amount of time the process was actively engaging with CPU

```bash
ps au
```
which displays processes from all users

# View All Processes

```bash
ps aux
```
which is not limiting processes within TTY but list also system-level processes that are not tied to processes we started ourselves

## Sort Processes -  CPU Usage

```bash
ps aux --sort=-pcpu | head - n 5
```
which returns top 5 processes in terms of using the most CPU

## Sort Processes - Memory Usage

```bash
ps aux --sort=-pmem | head - n 5
```
which returns top 5 processes in terms of the most used memory

# Change Process Priority

```bash
ps -l
```
which among others returns
- `PRI` - process priority
- `NI` - process niceness (to other processes) - betwee `-20` and `19`, higher number lower priority

## Change Priority for Running Process

```bash
renice -n 10 1356
renice -n 10 nano
```
which sets niceness to 10 for PID 1356 or process called nano.

## Change Priority on Process Start

```bash
nice -n 10 nano
```
which starts the editor and sets niceness to 10 right away.

# Signals

A signal instructs a process of  a request or change. Can be send via command (or by the kernel, another process). Each signal is also represented by the value.
- `SIGINT` - like `Ctrl + c` - running process on foreground is stopped
- `SIGTERM(15)` - cleanly terminates the process
- `SIGKILL(9)` - forces the process to terminate uncleanly

## Terminate Process

```bash
sudo kill 1256
```
which terminates the process with PID 1256 cleanly
- `kill` - by default the command sends SIGTERM(15) signal

```bash
sudo kill -9 1256
```
which sends `SIGKILL(9)` signal and forces the process to terminate uncleanly.

```bash
sudo killall nano
```
which terminates all processes with the name you've given it as an option (i.e. "nano")

# Managing System Processes

System processes = deamons = units. Run in the background and typically start when the system boots. The system processes are managed by `systemd` in Ubuntu and are called `units`.

## List Units

```bash
systemctl | grep nginx
```

## View Status

```bash
systemctl status nginx
```

## Start / Stop Unit

```bash
systemctl start nginx
systemctl stop nginx
```

## Enable / Disable on Boot

```bash
systemctl enable nginx
systemctl disable nginx
```

## Restart / Reload Unit

```bash
systemctl restart nginx
systemctl reload nginx
```

# Scheduling Tasks with Cron

Enable to set a script/command to run at specific time. User's Cron configuration is known as `crontab`.

```bash
crontab -e
```
which will edit user's cron configuration.

```bash 
* 0 * * * /usr/bin/apt update 
# m h dom mon dow command  
```
where
- `m` - minute
- `h` - hour
- `dom` - day of month
-  `mon` - month
-  `dow` - day of week
- `command` - fully qualified command (= output of `which`)