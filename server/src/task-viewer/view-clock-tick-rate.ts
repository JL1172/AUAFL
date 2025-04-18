import { exec } from "child_process";

export async function viewClockTickRate(): Promise<number | null>  {
  try {
    return await new Promise((resolve, reject) => {
      exec("getconf CLK_TCK", (err, stdout) => {
        if (err) reject(err);
        else resolve(+stdout);
      });
    });
  } catch {
    return null;
  }
}
