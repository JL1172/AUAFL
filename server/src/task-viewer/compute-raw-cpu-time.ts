import { rawCpuTimeObj } from "../types/process-types.js";
import * as fs from 'fs';
export function computeRawCpuTime(statFilePath: string): rawCpuTimeObj | null {
  try {
    const res = fs
      .readFileSync(statFilePath, { encoding: "utf-8" })
      ?.split(" ");
    const utime = +res[13];
    const stime = +res[14];
    const timestamp = Date.now();
    return {
      utime,
      stime,
      timestamp,
    };
  } catch {
    return null;
  }
}