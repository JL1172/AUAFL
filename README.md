# AUAFL

Another utility application for linux.

A powerful, custom-built task manager for Linux with a modern GUI, real-time updates, and precise control over system processes.

## Features

- **Real-Time Process Monitoring**

  - Displays CPU utilization and memory metrics such as:
    - `VmRSS`
    - `VmSwap`
    - `VmPeak`
    - `Threads`
  - Constantly polls data every second for up-to-date information.

- **Smart Process Aggregation**

  - Groups processes by name and averages memory/thread statistics across matching PIDs.
  - Ideal for tracking performance of multi-process applications (e.g., Chrome).

- **Sorting and Filtering**

  - Dynamically sort processes ascending or descending by:
    - CPU utilization
    - Memory usage (`VmRSS`, `VmSwap`, `VmPeak`)
    - Thread count

- **Process Termination**

  - Gracefully terminate processes using `SIGTERM`
  - Forcefully kill unresponsive processes with `SIGKILL`
  - Terminates all grouped PIDs under a process name for complete cleanup

- **Frontend**
  - Built with **React** and **Vite** for fast performance and sleek UI
  - Interactive controls for sorting, filtering, and process management

## Architecture Overview

- **Backend:**  
  Node.js server parses `/proc` to gather and compute metrics without third-party libraries.

- **Frontend:**  
  React + Vite frontend displays the task data and allows interactive sorting and management.

## Planned Features

- Fan control (auto/manual)
- CPU/GPU temperature readings
- Exportable logs or snapshots
- Process prioritization (renice-style control)

## Installation

#### ****Build it locally:***

**Run**

```
npm run package

sudo dpkg -i auafl-1.0.0.deb

auafl
```


> [!IMPORTANT]
> You will now have an application on your desktop called *AUAFL*

