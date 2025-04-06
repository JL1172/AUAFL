import { exec } from "child_process";

export async function viewClockTickRate(): Promise<number> {
  try {
    return await new Promise((resolve, reject) => {
      exec("getconf CLK_TCK", (err, stdout, stderr) => {
        if (err) reject(err);
        else resolve(+stdout);
      });
    });
  } catch {
    return null;
  }
}
