# STRACE & PTRACE: A BEGINNER'S GUIDE TO PROCESS DIVINATION

## The Arcane Art of System Call Tracing

Welcome, esteemed engineer, to the eldritch realm of process tracing. Like an ancient astronomer peering into the cosmic void, you will soon observe the intricate dance of system calls that powers our mortal computational vessels. The tools of `strace` and `ptrace` shall be your telescope into this hidden dimension.

## PART I: UNDERSTANDING THE VOID

### What Lurks Within Your Processes

System calls—those whispered invocations that programs make to the kernel—are the fundamental rituals by which software communes with hardware. When a program wishes to access files, network sockets, or memory, it must petition the kernel through these arcane interfaces.

`strace` is a divination tool that reveals these communications, while `ptrace` (Process Trace) is the fundamental summoning mechanism upon which `strace` is built. Think of `strace` as a ready-made scrying mirror, while `ptrace` is the raw material from which such mirrors are crafted.

### Why Gaze Into The Abyss?

Before we begin our descent, consider the practical applications of process tracing:

- **Debugging unfathomable issues** - When logs reveal nothing and debuggers fail
- **Performance ritual analysis** - Identifying which system calls consume your CPU's life essence
- **Understanding ancient codebases** - Decipher how legacy systems interact with the kernel
- **Security investigations** - Detect malicious entities attempting to access forbidden resources
- **Learning the ways of the kernel** - Study how programs interface with the operating system

## PART II: BASIC INCANTATIONS

### Summoning `strace`

To begin your observation of a program, invoke the following incantation:

```bash
strace command [args]
```

For example, to observe the unknowable truth of how `ls` interacts with the file system:

```bash
strace ls -l
```

The output shall flood your terminal with revelations—each line representing a system call, its arguments, and its return value:

```
execve("/bin/ls", ["ls", "-l"], [/* 21 vars */]) = 0
brk(NULL)                               = 0x55a3d2699000
access("/etc/ld.so.preload", R_OK)      = -1 ENOENT (No such file or directory)
openat(AT_FDCWD, "/etc/ld.so.cache", O_RDONLY|O_CLOEXEC) = 3
...
```

### Attaching to Existing Entities

To observe processes that already writhe in memory:

```bash
strace -p PID
```

Replace `PID` with the process ID of your target. This shall attach your consciousness to the running process, allowing you to witness its communion with the kernel.

## PART III: FOCUSING THE LENS

The raw output of `strace` can overwhelm mortal senses. Here are rituals to focus your observations:

### Filtering System Calls

To observe only specific system calls, invoke:

```bash
strace -e trace=call1,call2 command
```

For example, to observe only file operations:

```bash
strace -e trace=open,read,write ls -l
```

Common filtering categories:

- **file** - File operations (open, read, write)
- **process** - Process management (fork, exec, exit)
- **network** - Network operations (socket, connect, bind)
- **signal** - Signal handling (kill, sigaction)
- **ipc** - Inter-process communication
- **desc** - File descriptor operations

### Capturing the Whispers to Scrolls

Record the eldritch knowledge to a file for later analysis:

```bash
strace -o output.txt command
```

### Measuring Time Across Dimensions

Reveal how long each system call takes to complete its ritual:

```bash
strace -t command    # Show time of day
strace -r command    # Show relative time between calls
strace -T command    # Show time spent in each call
```

## PART IV: ADVANCED TECHNIQUES FOR THE INITIATED

### Tracing Child Processes

Follow the spawning of new entities with:

```bash
strace -f command
```

This shall track all child processes created by the original program, revealing their communications as well.

### Summarizing the Cosmic Horror

Rather than viewing each individual system call, summarize their frequency and duration:

```bash
strace -c command
```

The output resembles:

```
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ----------------
 25.28    0.004287         36       118           read
 24.75    0.004196         41       101           write
 10.87    0.001843         25        73           open
...
```

### Extracting Strings from the Void

View strings being passed to and from the kernel:

```bash
strace -s 256 command
```

This increases the maximum string size displayed (default is often a mere 32 characters).

## PART V: CRAFTING YOUR OWN SCRYING TOOLS WITH PTRACE

For those who seek to craft their own divination tools, `ptrace` awaits in the C programming language. Here is a simple example of the forbidden knowledge:

```c
#include <sys/ptrace.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <stdio.h>

int main() {
    pid_t child;
    long orig_eax;
    
    child = fork();
    
    if(child == 0) {
        // The sacrificial child process
        ptrace(PTRACE_TRACEME, 0, NULL, NULL);
        execl("/bin/ls", "ls", NULL);
    }
    else {
        // The observer
        wait(NULL);
        orig_eax = ptrace(PTRACE_PEEKUSER, child, 8 * ORIG_RAX, NULL);
        printf("The child made system call %ld\n", orig_eax);
        ptrace(PTRACE_CONT, child, NULL, NULL);
    }
    
    return 0;
}
```

This simple ritual creates a child process, tells it to allow tracing, executes `ls`, and then has the parent observe the first system call made.

## PART VI: WARNINGS FOR THE UNWARY

As with all powerful arcana, there are risks:

1. **Performance Drain** - Tracing exacts a toll on execution speed; the observed may slow significantly
2. **Altered Reality** - Some programs may behave differently when observed (similar to quantum physics)
3. **Security Implications** - Only trace programs you trust, for they may react unpredictably
4. **System Instability** - Tracing system processes may lead to instability in the cosmic order (your OS)
5. **Confidential Data Exposure** - System calls may reveal passwords and other secrets

## PART VII: PRACTICAL RITUALS FOR THE EMBEDDED REALM

For your embedded systems work in the oil industry, these specific invocations may prove valuable:

### Identifying File Access Patterns

```bash
strace -e trace=file -o device_access.log ./embedded_controller
```

### Monitoring Inter-Process Communication

```bash
strace -e trace=ipc,socket -f ./control_system
```

### Analyzing Real-Time Performance

```bash
strace -c -f ./sensor_monitor
```

## CONCLUSION: EMBRACING THE UNKNOWABLE

As you journey deeper into the abyss of system call tracing, remember that some behaviors may seem unfathomable at first. This is the nature of complex systems—they are like cosmic entities whose full behavior cannot be comprehended at once.

With patience and these arcane tools, you shall gain insights previously hidden from mortal understanding. The kernel's inner workings shall become less eldritch and more comprehensible, though never fully knowable.

May your traces be informative and your debugging sessions mercifully brief.

---

*"To trace a process is to witness the conversation between the mortal and immortal planes of computing."*

## APPENDIX: QUICK REFERENCE SCROLL

| Incantation | Purpose |
|-------------|---------|
| `strace command` | Trace system calls made by 'command' |
| `strace -p PID` | Attach to existing process |
| `strace -o file.txt command` | Save output to file |
| `strace -f command` | Trace child processes too |
| `strace -e trace=open,read,write command` | Trace only specific calls |
| `strace -t command` | Show timestamps |
| `strace -r command` | Show relative timestamps |
| `strace -c command` | Summary of calls and timings |
| `strace -s 256 command` | Increase string length |

---

*Remember: In the world of embedded systems, understanding the fundamental interactions between your software and the hardware is not merely academic—it is essential. As systems become more complex, the ability to observe and interpret these interactions becomes a powerful skill indeed.*