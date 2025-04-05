import * as fs from "fs";
import { exec } from "child_process";
import path from "path";

interface ProcessObj {
  Name: string;
  Pid: string;
  VmPeak: string;
  VmRSS: string;
  RssAnon: string;
  Threads: string;
  VmSize: string;
  VmSwap: string;
  cpuUtilization: number;
  memoryUtilization: string;
  rawCpuTime: { utime: number; stime: number; timestamp: number };
}
interface Process {
  [key: string]: ProcessObj | number;
  memory: number;
  currSwap: number;
  currRam: number;
  memPeakAverage: number;
  averageCpuTime: number;
}
async function computeCpuTime(pid: string) {
  try {
    const statFilePath = `/proc/${pid}/stat`;
    const data = fs.readFileSync(statFilePath, { encoding: "utf-8" });
    const fields = data.split(" ");
    const utime = parseInt(fields[13]); // user mode time
    const stime = parseInt(fields[14]); //kernel mode time
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // const data2 = fs.readFileSync(statFilePath, { encoding: "utf-8" });
    // const fields2 = data2.split(" ");
    // const utime2 = parseInt(fields2[13]); // user mode time
    // const stime2 = parseInt(fields2[14]); //kernel mode time
    // const secondTotalCpuTime = utime2 + stime2;
    // const cpuUsage = ((secondTotalCpuTime - firstTotalCpuTime) / 1000) * 100;
    return {
      utime,
      stime,
      timestamp: Date.now(),
    };
  } catch {
    console.error(`Error computing utilization percentage`);
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
    const map = {
      Name: "",
      Pid: "",
      VmPeak: "",
      VmRSS: "",
      RssAnon: "",
      VmSwap: "",
      Threads: "",
      memoryUtilization: 0,
      cpuUtilization: 0,
      rawCpuTime: null,
    };
    (await fs.promises.readFile(path, { encoding: "utf-8" }))
      ?.split("\n")
      ?.map((n) => {
        const lineSplit = n?.split(":");
        if (arrToCompare.some((item) => item === lineSplit?.[0]?.trim())) {
          found--;

          map[lineSplit[0]?.trim()] = lineSplit?.[1]
            ?.replace(/\t/g, "")
            ?.trim();
        }
      });
    if (found === 0) {
      const cpuUtilizationResult = await computeCpuTime(pid);

      if (!cpuUtilizationResult) {
        return null;
      } else {
        map.rawCpuTime = cpuUtilizationResult;
        map.memoryUtilization = +(
          (Number(map.VmRSS?.split(" ")[0]) / totalRamSize) *
          100
        );
        return map;
      }
    }
    return null;
  } catch {
    console.error(`Error reading status file from process: ${pid}`);
    // throw new Error(`Error reading status file from process: ${pid}` + err);
  }
}

async function viewRamTotal() {
  try {
    return (await fs.promises.readFile("/proc/meminfo", { encoding: "utf-8" }))
      ?.split("\n")?.[0]
      ?.split(":")?.[1]
      ?.replace(/\t/g, "")
      ?.trim();
  } catch {
    console.error("Error reading system memory files");
  }
}

async function viewTasks(previousProcArr?: Process[]) {
  const computeCpuUtilization = Boolean(previousProcArr);
  try {
    const ramMemTotal = await viewRamTotal();
    if (!ramMemTotal) {
      console.error("Problem fetching system memory stats");
      return;
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

    /**
     * name
     * pid
     * VmPeak // max amount of virutal memory proc has used virtual memory
     * VmSize (ram swap space) // total virtual memory process is using bot hram and swap space
     * VmRSS (ram) // amount of ram currently being used
     * RssAnon if high it can indicate that the process is using a lot of dynamic allocation, potential memory leaks or inefficient memory use
     * VmSwap space on disk used when ram is exhausted
     * threads
     */
    let strict_arr = new Array(processList?.length).fill(0);
    const idx_map = {};
    const len = processList?.length;
    let strict_arr_idx_tracker = 0;
    for (let i = 0; i < len; i++) {
      const currentPidToView = processList[i];
      const statusFilePath = path.join("/proc", currentPidToView, "status");
      const process = await readStatusFile(
        statusFilePath,
        currentPidToView,
        arrToCompare,
        Number(ramMemTotal?.split(" ")[0])
      );
      if (process) {
        const { Name } = process;
        if (Name in idx_map) {
          const index = idx_map[Name];
          const procArrLen = strict_arr[index][Name]?.length + 1;
          strict_arr[index] = {
            [Name]: [...strict_arr[index][Name], process],
            memPeakAverage: Math.floor(
              (strict_arr[index].memPeakAverage +
                Number(process.VmPeak?.split(" ")?.[0])) /
                procArrLen
            ),
            currRam: Math.floor(
              (strict_arr[index].currRam +
                Number(process.VmRSS?.split(" ")?.[0])) /
                procArrLen
            ),
            currSwap: Math.floor(
              (strict_arr[index].currSwap +
                Number(process.VmSwap?.split(" ")?.[0])) /
                procArrLen
            ),
            memory: Math.floor(
              (strict_arr[index].memory + process.memoryUtilization) /
                procArrLen
            ),
            averageCpuTime: 0,
            displayCpuTime: computeCpuUtilization,
          };
        } else {
          idx_map[Name] = strict_arr_idx_tracker;
          strict_arr[strict_arr_idx_tracker] = {
            [Name]: [process],
            memPeakAverage: Number(process.VmPeak?.split(" ")?.[0]),
            currRam: Number(process.VmRSS?.split(" ")?.[0]),
            currSwap: Number(process.VmSwap?.split(" ")?.[0]),
            memory: process.memoryUtilization,
            averageCpuTime: process.cpuUtilization,
            displayCpuTime: computeCpuUtilization,
          };
          strict_arr_idx_tracker++;
        }
      }
    }

    strict_arr = strict_arr.filter((n) => n !== 0);
    if (computeCpuUtilization && previousProcArr?.length > 0) {
      const lenOfStrictArr = strict_arr?.length;
      for (let j = 0; j < lenOfStrictArr; j++) {
        const currProc = strict_arr[j];
        const nameOfProc = Object.keys(currProc)?.find((key) =>
          Array.isArray(currProc[key])
        );

        if (!nameOfProc) continue;

        const currentProcesses = currProc[nameOfProc];

        const previousProcess = previousProcArr?.find((n) => nameOfProc in n);

        if (!previousProcess) continue;

        const previousProcesses = previousProcess[nameOfProc];

        let totalCpuUtilization = 0;
        let matchCount = 0;

        const lenOfCurrentProc = currentProcesses?.length;
        for (let i = 0; i < lenOfCurrentProc; i++) {
          const currentSubProcess = currentProcesses[i];
          const matchingPreviousProcess = (previousProcesses as any)?.find(
            (n: ProcessObj) => n?.Pid === currentSubProcess?.Pid
          ) as ProcessObj;
          if (
            matchingPreviousProcess &&
            currentSubProcess.rawCpuTime &&
            matchingPreviousProcess?.rawCpuTime
          ) {
            const timeDiff = (currentSubProcess?.rawCpuTime?.timestamp - matchingPreviousProcess?.rawCpuTime?.timestamp) / 1000;
            if (timeDiff <=0) continue;

            const prevTotal = matchingPreviousProcess?.rawCpuTime?.utime + matchingPreviousProcess?.rawCpuTime?.stime;
            const currTotal = currentSubProcess?.rawCpuTime?.utime + currentProcesses?.rawCpuTime?.stime;
            const cpuTimeDiff = currTotal - prevTotal;

            const clockTicksPerSecond = 100; 
            const utilization = (cpuTimeDiff / (clockTicksPerSecond * timeDiff)) * 100;
            currentSubProcess.cpuUtilization = Math.max(0, utilization);
            totalCpuUtilization  += currentSubProcess?.cpuUtilization;
            matchCount++;
          }
        }

        currProc.averageCpuTime = matchCount > 0 ? totalCpuUtilization / matchCount : 0;
        currProc.displayCpuTime = true;

      
      }
    }

    strict_arr.sort((a, b) => {
      return a?.averageCpuTime - b?.averageCpuTime;
    });
    return strict_arr;
  } catch (err) {
    console.log(err);
    return;
  }
}

export { viewTasks };
