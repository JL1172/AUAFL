import fs from 'fs';
import { computeCpuTime } from './compute-cpu-time.ts';
export async function readStatusFile(
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