import * as fs from 'fs';
export function viewRamTotal(): number | null {
  try {
    const ramTotal = +fs
      .readFileSync("/proc/meminfo", { encoding: "utf-8" })
      ?.split("\n")?.[0]
      ?.split(":")?.[1]
      ?.replace(/\t/g, "")
      ?.trim()
      ?.split(" ")?.[0];
    return ramTotal;
  } catch (err) {
    console.log(err);
    return null;
  }
}
