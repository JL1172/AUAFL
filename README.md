# AUAFL

Another utility application for Linux.  
A powerful, custom-built task manager for Linux featuring a modern GUI, real-time updates, and precise control over system processes – now with temperature sensor monitoring!

## Features

- **Real-Time Process Monitoring**

  - Displays CPU utilization and memory metrics such as:
    - `VmRSS`
    - `VmSwap`
    - `VmPeak`
    - `Threads`
  - Continuously polls data every second to ensure up-to-date system information.

- **Smart Process Aggregation**

  - Groups processes by name and calculates average memory/thread statistics across matching PIDs.
  - Ideal for tracking performance of multi-process applications (e.g., Chrome).

- **Sorting and Filtering**

  - Dynamically sorts processes in both ascending and descending order by:
    - CPU utilization
    - Memory usage (`VmRSS`, `VmSwap`, `VmPeak`)
    - Thread count

- **Process Termination**

  - Allows graceful process termination using `SIGTERM`.
  - Offers forceful process termination with `SIGKILL` for unresponsive processes.
  - Terminates all grouped PIDs under a process name for complete cleanup.

- **Temperature Sensors**

  - Now integrated with additional temperature sensors for different thermals.
  - Reads thermal data directly from the `sys/class/thermal` directory, providing real-time monitoring of various system thermal zones.

- **Frontend**
  - Built with **React** and **Vite** for a fast, sleek user interface.
  - Offers interactive controls for sorting, filtering, and comprehensive process management.

## Architecture Overview

- **Backend:**  
  A Node.js server that parses the `/proc` file system to gather and compute metrics without relying on third-party libraries.

- **Frontend:**  
  A React + Vite application that displays task data and supports interactive sorting and management.

## Planned Features

- Fan control (auto/manual)
- Enhanced CPU/GPU temperature readings
- Exportable logs or snapshots
- Process prioritization (renice-style control)

## Installation

#### **Build it locally:**

Navigate to the `main.ts` file, locate the `startBackend` function, and replace the `command` variable's value with your computer's path to Node.js in the `else` block.

**Run:**

```bash
npm run package
sudo dpkg -i auafl-1.0.0.deb
auafl

```
> [!IMPORTANT]
> You will now have an application on your desktop called AUAFL
