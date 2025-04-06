import { Process, ProcessObj } from "../types/process-types.ts";
import { calculateAverageCpuUtilization } from "./calc-cpu-utilization.ts";
import { applyFilters } from "./apply-filters.ts";
import { readAndParseProcessStatFile } from "./parse-process-file.ts";
import { viewRamTotal } from "./view-ram-total.ts";
import { readProcDir } from "./read-proc-dir.ts";
import { viewClockTickRate } from "./view-clock-tick-rate.ts";

function log(log: string, persist_process?: boolean) {
  console.error(log);
  if (!persist_process) return;
}


async function view_system_processes(
  filters: string[],
  previous_process_arr?: Process[]
) {
  try {
    let display_cpu_utilization_flag: boolean = false;
    if (previous_process_arr?.length > 0) {
      display_cpu_utilization_flag = true;
    }
    const ramTotal = viewRamTotal();
    if (ramTotal === null) log("Error reading meminfo file");
    const clockTickRate = (await viewClockTickRate()) ?? 100;
    if (!clockTickRate) {
      log("Error fetching clock tick rate defaulting to 100", true);
    }
    //constants to avoid recreation
    const readProcCommand: string = "cd /proc && ls" as const;
    const expectedProcessFields: string[] = [
      "Name",
      "Pid",
      "VmPeak",
      "VmRSS",
      "Threads",
      "VmSize",
      "VmSwap",
    ] as const;
    const expectedCount = expectedProcessFields?.length;

    //process directories
    const processDirectories = await readProcDir(readProcCommand);
    if (processDirectories === null) log("Error reading /proc directory");

    //this allows o(1) insertion and fetching.
    const len = processDirectories?.length;
    const system_process_array: Process[] = new Array(len).fill(0);
    const index_map = {};
    let idx_tracker = 0;
    for (let i = 0; i < len; i++) {
      const currProcDir: number = +processDirectories[i]; //pid
      const pathToStatFile: string = `/proc/${currProcDir}/status`;
      //return process obj
      const processData: ProcessObj = await readAndParseProcessStatFile(
        pathToStatFile,
        currProcDir,
        expectedProcessFields,
        expectedCount,
        ramTotal
      );
      if (processData === null) continue;
      const { Name } = processData;
      if (Name in index_map) {
        //no unnecessary copies
        const indexOfName = index_map[Name];
        const process = system_process_array[indexOfName];
        const inner_proc_arr_len: number =
          (process[Name] as ProcessObj[])?.length + 1;
        const new_proc = processData;
        (process[Name] as ProcessObj[]).push(new_proc);
        process.currRam = Math.floor(
          (process.currRam + processData.VmRSS) / inner_proc_arr_len
        );
        process.currSwap = Math.floor(
          (process.currRam + processData.VmSwap) / inner_proc_arr_len
        );
        process.memory = Math.floor(
          (process.memory + processData.memoryUtilization) / inner_proc_arr_len
        );
        process.memPeakAverage = Math.floor(
          (process.memPeakAverage + processData.VmPeak) / inner_proc_arr_len
        );
        process.averageThreads = Math.floor(
          (process.averageThreads + processData.Threads) / inner_proc_arr_len
        );
      } else {
        const processToConstruct: Process = {
          [Name]: [processData],
          PidToDisplay: processData.Pid,
          processName: Name,
          averageCpuTime: 0,
          averageThreads: processData.Threads,
          currRam: processData.VmRSS,
          currSwap: processData.VmSwap,
          memPeakAverage: processData.VmPeak,
          displayCpuTime: display_cpu_utilization_flag,
          memory: processData.memoryUtilization,
        };
        system_process_array[idx_tracker] = processToConstruct;
        index_map[Name] = idx_tracker;
        idx_tracker++;
      }
    }
    //more efficient then using slice and making a copy. this frees up the rest of the array we know is not there
    system_process_array.length = idx_tracker;

    //cpu calculations
    calculateAverageCpuUtilization(
      clockTickRate,
      display_cpu_utilization_flag,
      previous_process_arr,
      idx_tracker,
      system_process_array
    );

    //apply filters
    applyFilters(filters, system_process_array);

    return system_process_array;
  } catch (err) {
    console.error("Error reading system processes");
    return;
  }
}

export {view_system_processes};