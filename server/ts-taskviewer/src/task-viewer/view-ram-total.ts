import fs from 'fs';
export async function viewRamTotal() {
  try {
    const meminfo = await fs.promises.readFile("/proc/meminfo", { encoding: "utf-8" });
    return meminfo
      ?.split("\n")?.[0]
      ?.split(":")?.[1]
      ?.replace(/\t/g, "")
      ?.trim();
  } catch (err) {
    console.error("Error reading system memory files:", err);
    return null;
  }
}