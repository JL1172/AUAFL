import { ProcessObj } from "../types/process-types.js";
import { computeRawCpuTime } from "./compute-raw-cpu-time.js";
import * as fs from "fs";
export async function readAndParseProcessStatFile(
  pathToStatFile: string,
  pid: number,
  expectedProcessFields: string[],
  expectedCount: number,
  ramTotal: number
): Promise<ProcessObj | null> {
  try {
    const processObj: ProcessObj = {
      Name: "",
      Pid: 0,
      VmPeak: 0,
      VmRSS: 0,
      Threads: 0,
      VmSize: 0,
      VmSwap: 0,
      cpuUtilization: 0,
      memoryUtilization: 0,
      rawCpuTime: null,
      isSystemProcess: false,
      Uid: "",
    };

    (await fs.promises.readFile(pathToStatFile, { encoding: "utf-8" }))
      ?.split("\n")
      ?.map((n) => {
        const currentLineInStatFile: string[] = n?.split(":");
        const currentKeyInLine =
          currentLineInStatFile?.[0].trim() as keyof ProcessObj;
        const currentValueInLine: string[] = currentLineInStatFile?.[1]
          ?.replace(/\t/g, "")
          .trim()
          .split(" ");

        const result: boolean = expectedProcessFields.some((field) => {
          return field === currentKeyInLine;
        });
        if (result === true) {
          if (currentKeyInLine !== "Name" && currentKeyInLine !== "Uid") {
            (processObj[currentKeyInLine] as any) = +currentValueInLine?.[0];
            expectedCount--;
          } else if (currentKeyInLine === "Name") {
            processObj[currentKeyInLine] = currentValueInLine?.[0];
            expectedCount--;
          } else if (currentKeyInLine === "Uid" && !processObj.Uid) {
            processObj.Uid = currentValueInLine?.[0];
            processObj.isSystemProcess =
              currentValueInLine?.[0]?.startsWith("0");
            expectedCount--;
          }
        }
      });
    if (expectedCount !== 0) {
      return null;
    }
    const rawCpuTimeTotal = computeRawCpuTime(`/proc/${pid}/stat`);
    if (!rawCpuTimeTotal) {
      return null;
    }
    processObj.rawCpuTime = rawCpuTimeTotal;
    //percentage

    const ramMemoryUtilizationPercentage = (processObj.VmRSS / ramTotal) * 100;
    processObj.memoryUtilization = ramMemoryUtilizationPercentage;
    return processObj;
  } catch {
    return null;
  }
}
