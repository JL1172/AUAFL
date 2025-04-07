import { Process, ProcessObj } from "../types/process-types.js";
import { calculateCpuUtilization } from "./calc-cpu-utilization.js";
import { applyFilters } from "./apply-filters.js";
import { readAndParseProcessStatFile } from "./parse-process-file.js";
import { viewRamTotal } from "./view-ram-total.js";
import { readProcDir } from "./read-proc-dir.js";
import { viewClockTickRate } from "./view-clock-tick-rate.js";

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
    if (previous_process_arr && previous_process_arr?.length > 0) {
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
      "Uid",
    ] as const;

    const expectedCount = expectedProcessFields?.length;

    //process directories
    const processDirectories = await readProcDir(readProcCommand);
    if (processDirectories === null) log("Error reading /proc directory");

    //this allows o(1) insertion and fetching.
    const len = (processDirectories as string[]).length as number;
    const system_process_array: Process[] = new Array(len).fill(0);
    const index_map: {[key: string]: number} = {};
    let idx_tracker = 0;
    for (let i = 0; i < len; i++) {
      const currProcDir: number = +(processDirectories?.[i] as string); //pid
      const pathToStatFile: string = `/proc/${currProcDir}/status`;
      //return process obj
      const processData: ProcessObj | null = await readAndParseProcessStatFile(
        pathToStatFile,
        currProcDir,
        expectedProcessFields,
        expectedCount,
        ramTotal as number
      );
      if (processData === null) continue;
      const { Name } = processData;
      if (Name in index_map) {
        //no unnecessary copies
        const indexOfName = index_map[Name];
        const process = system_process_array[indexOfName];
        const new_proc = processData;
        (process[Name] as ProcessObj[]).push(new_proc);
        process.totalVmRSS += processData.VmRSS;
        process.totalSwap += processData.VmSwap;
        process.totalMemoryUtilization += processData.memoryUtilization;
        process.totalVmPeak += processData.VmPeak;
        process.totalThreads += processData.Threads;
      } else {
        const processToConstruct: Process = {
          [Name]: [processData],
          PidToDisplay: processData.Pid,
          processName: Name,
          totalCpuUtilization: 0,
          totalThreads: processData.Threads,
          totalVmRSS: processData.VmRSS,
          totalSwap: processData.VmSwap,
          totalVmPeak: processData.VmPeak,
          displayCpuTime: display_cpu_utilization_flag,
          totalMemoryUtilization: processData.memoryUtilization,
          isSystemProcess: processData.isSystemProcess,
        };
        system_process_array[idx_tracker] = processToConstruct;
        index_map[Name]= idx_tracker;
        idx_tracker++;
      }
    }
    //more efficient then using slice and making a copy. this frees up the rest of the array we know is not there
    system_process_array.length = idx_tracker;

    //cpu calculations
    calculateCpuUtilization(
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

export { view_system_processes };
