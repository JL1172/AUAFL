import { Process, ProcessObj } from "../types/process-types.ts";

export async function killProcess(
  processToKill: Process,
  retry: boolean = false
) {
  try {
    if (retry) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const processList = processToKill[
      processToKill.processName
    ] as ProcessObj[];

    if (!processList?.length) {
      return "No processes found to kill";
    }
    const proc_len: number = processList?.length;
    let failed_pids = 0;
    for (let i = 0; i < proc_len; i++) {
      const currPid = processList[i]?.Pid;
      try {
        const signal = retry ? "SIGKILL" : "SIGTERM";
        process.kill(currPid, signal);
      } catch {
        failed_pids++;
      }
    }
    if (failed_pids > 0 && retry === false) {
      return await killProcess(processToKill, true);
    }
    return "Processes killed successfully";
  } catch {
    console.error("Error killing process");
    return;
  }
}
