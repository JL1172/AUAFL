import { Process, ProcessObj } from "../global-types/process-types.ts";

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

    const proc_len = processList?.length;
    for (let i = 0; i < proc_len; i++) {
      const currPid = processList[i]?.Pid;
      try {
        process.kill(+currPid, 0);
        if (retry) {
          process.kill(+currPid, "SIGKILL");
        } else {
          process.kill(+currPid, "SIGTERM");
        }
      } catch {
        continue;
      }
    }
    if (!retry) {
      killProcess(processToKill, true);
    } else {
      return "All processes killed";
    }
  } catch {
    console.error("Error killing process");
    return;
  }
}
