import * as fs from "fs";
import { exec } from "child_process";
import path from "path";

export interface ProcessObj {
  Name: string;
  Pid: string;
  VmPeak: string;
  VmRSS: string;
  RssAnon: string;
  Threads: string;
  VmSize: string;
  VmSwap: string;
  cpuUtilization: number;
  memoryUtilization: number;
  rawCpuTime: { utime: number; stime: number; timestamp: number };
}

export interface Process {
  [key: string]: ProcessObj[] | number | boolean | string;
  memory: number;
  currSwap: number;
  currRam: number;
  memPeakAverage: number;
  averageCpuTime: number;
  displayCpuTime: boolean;
  averageThreads: number;
  processName:string;
}

function computeCpuTime(pid: string) {
  try {
    const statFilePath = `/proc/${pid}/stat`;
    const data = fs.readFileSync(statFilePath, { encoding: "utf-8" });
    const fields = data.split(" ");
    const utime = parseInt(fields[13]); // user mode time
    const stime = parseInt(fields[14]); // kernel mode time
    
    return {
      utime,
      stime,
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error(`Error computing CPU time for process ${pid}:`, err);
    return null;
  }
}

async function readStatusFile(
  path: string,
  pid: string,
  arrToCompare: string[],
  totalRamSize: number
) {
  try {
    let found = arrToCompare?.length;
    const map: any = {
      Name: "",
      Pid: "",
      VmPeak: "",
      VmRSS: "",
      RssAnon: "",
      VmSwap: "",
      Threads: "",
      VmSize: "",
      memoryUtilization: 0,
      cpuUtilization: 0,
      rawCpuTime: null,
    };
    
    (await fs.promises.readFile(path, { encoding: "utf-8" }))
      ?.split("\n")
      ?.forEach((n) => {
        const lineSplit = n?.split(":");
        if (lineSplit?.[0] && arrToCompare.includes(lineSplit[0]?.trim())) {
          found--;
          map[lineSplit[0]?.trim()] = lineSplit?.[1]
            ?.replace(/\t/g, "")
            ?.trim();
        }
      });
      
    if (found === 0) {
      const cpuTimeResult = computeCpuTime(pid);

      if (!cpuTimeResult) {
        return null;
      } else {
        map.rawCpuTime = cpuTimeResult;
        map.memoryUtilization = 
          (parseInt(map.VmRSS?.split(" ")[0]) / totalRamSize) * 100;
        return map;
      }
    }
    return null;
  } catch (err) {

    return null;
  }
}

async function viewRamTotal() {
  try {
    const meminfo = await fs.promises.readFile("/proc/meminfo", { encoding: "utf-8" });
    return meminfo
      ?.split("\n")?.[0]
      ?.split(":")?.[1]
      ?.replace(/\t/g, "")
      ?.trim();
  } catch (err) {
    console.error("Error reading system memory files:", err);
    return null;
  }
}

async function viewTasks(previousProcArr?: Process[], filters?: string[]) {
  const computeCpuUtilization = Boolean(previousProcArr);
  try {
    const ramMemTotal = await viewRamTotal();
    if (!ramMemTotal) {
      console.error("Problem fetching system memory stats");
      return [];
    }
    
    const arrToCompare = [
      "Name",
      "Pid",
      "VmPeak",
      "VmSize",
      "VmRSS",
      "RssAnon",
      "VmSwap",
      "Threads",
    ];
    
    const processList: string[] = await new Promise((resolve, reject) => {
      exec("cd /proc && ls", (err, data) => {
        if (err) reject(err);
        else resolve(data?.split("\n")?.filter((n) => !isNaN(Number(n))));
      });
    });

    let strict_arr: Process[] = new Array(processList?.length).fill(0);
    const idx_map: {[key: string]: number} = {};
    const len = processList?.length;
    let strict_arr_idx_tracker = 0;
    
    for (let i = 0; i < len; i++) {
      const currentPidToView = processList[i];
      const statusFilePath = path.join("/proc", currentPidToView, "status");
      const process = await readStatusFile(
        statusFilePath,
        currentPidToView,
        arrToCompare,
        parseInt(ramMemTotal?.split(" ")[0])
      );
      
      if (process) {
        const { Name } = process;
        if (Name in idx_map) {
          const index = idx_map[Name];
          const procArr = strict_arr[index][Name] as ProcessObj[];
          const procArrLen = procArr.length + 1;
   
          strict_arr[index] = {
            [Name]: [...procArr, process],
            memPeakAverage: Math.floor(
              (strict_arr[index].memPeakAverage as number +
                parseInt(process.VmPeak?.split(" ")?.[0])) /
                procArrLen
            ),
            currRam: Math.floor(
              (strict_arr[index].currRam as number +
                parseInt(process.VmRSS?.split(" ")?.[0])) /
                procArrLen
            ),
            currSwap: Math.floor(
              (strict_arr[index].currSwap as number +
                parseInt(process.VmSwap?.split(" ")?.[0])) /
                procArrLen
            ),
            memory: Math.floor(
              (strict_arr[index].memory as number + process.memoryUtilization) /
                procArrLen
            ),
            averageCpuTime: 0,
            displayCpuTime: computeCpuUtilization,
            averageThreads: process.Threads,
            processName: Name,
          };
        } else {
          idx_map[Name] = strict_arr_idx_tracker;
          strict_arr[strict_arr_idx_tracker] = {
            [Name]: [process],
            memPeakAverage: parseInt(process.VmPeak?.split(" ")?.[0]),
            currRam: parseInt(process.VmRSS?.split(" ")?.[0]),
            currSwap: parseInt(process.VmSwap?.split(" ")?.[0]),
            memory: process.memoryUtilization,
            averageCpuTime: 0,
            displayCpuTime: computeCpuUtilization,
            averageThreads: process.Threads,
            processName: process.Name,
          };
          strict_arr_idx_tracker++;
        }
      }
    }

    strict_arr = strict_arr.filter((n:any) => n !== 0);
    
    if (computeCpuUtilization && previousProcArr?.length > 0) {
      const lenOfStrictArr = strict_arr?.length;
      for (let j = 0; j < lenOfStrictArr; j++) {
        const currProc = strict_arr[j];
        const nameOfProc = currProc?.processName;

        if (!nameOfProc) continue;

        const currentProcesses = currProc[nameOfProc] as ProcessObj[];
        const previousProcess = previousProcArr?.find((n) => nameOfProc in n);

        if (!previousProcess) continue;

        const previousProcesses = previousProcess[nameOfProc] as ProcessObj[];

        let totalCpuUtilization = 0;
        let matchCount = 0;

        const lenOfCurrentProc = currentProcesses?.length;
        for (let i = 0; i < lenOfCurrentProc; i++) {
          const currentSubProcess = currentProcesses[i];
          const matchingPreviousProcess = previousProcesses?.find(
            (n: ProcessObj) => n?.Pid === currentSubProcess?.Pid
          );
          
          if (
            matchingPreviousProcess &&
            currentSubProcess.rawCpuTime &&
            matchingPreviousProcess?.rawCpuTime
          ) {
            const timeDiff = 
              (currentSubProcess.rawCpuTime.timestamp - 
              matchingPreviousProcess.rawCpuTime.timestamp) / 1000;
              
            if (timeDiff <= 0) continue;

            const prevTotal = 
              matchingPreviousProcess.rawCpuTime.utime + 
              matchingPreviousProcess.rawCpuTime.stime;
              
            const currTotal = 
              currentSubProcess.rawCpuTime.utime + 
              currentSubProcess.rawCpuTime.stime;  // Fixed this line
              
            const cpuTimeDiff = currTotal - prevTotal;
            
            // On Linux, /proc/stat reports in USER_HZ, typically 100 ticks per second
            const clockTicksPerSecond = 100; 
            
            // Calculate CPU utilization as percentage of one CPU core
            const utilization = (cpuTimeDiff / (clockTicksPerSecond * timeDiff)) * 100;
            
            currentSubProcess.cpuUtilization = Math.max(0, Math.min(100, utilization));
            totalCpuUtilization += currentSubProcess.cpuUtilization;
            matchCount++;
          }
        }

        currProc.averageCpuTime = matchCount > 0 ? totalCpuUtilization / matchCount : 0;
        currProc.displayCpuTime = true;
      }
    }

    // Sort by CPU utilization (descending)
    if (filters) {
      const [field, direction]= filters;
      if (direction === 'asc') {
        if (field === "Name") {
          strict_arr.sort((a, b) => {
            const name = a.processName;
            const name2 = b.processName;
            return name < name2 ? 1 : -1;
          });
        } else {

          strict_arr.sort((a, b) => {
            return (a?.[field] as number) - (b?.[field] as number);
          });
        }
      } else {
        if (field === "Name") {
          strict_arr.sort((a, b) => {
            const name = a.processName;
            const name2 = b.processName;
            return name2 < name ? 1 : -1;
          });
        } else {

          strict_arr.sort((a, b) => {
            return (b?.[field] as number) - (a?.[field] as number);
          });
        }
     
      }
    }
    
    return strict_arr;
  } catch (err) {
    console.error("Error in viewTasks:", err);
    return [];
  }
}

export { viewTasks };