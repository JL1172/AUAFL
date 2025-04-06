import fs from 'fs';
export function computeCpuTime(pid: string) {
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