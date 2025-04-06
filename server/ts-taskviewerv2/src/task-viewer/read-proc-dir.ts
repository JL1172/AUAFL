import { exec } from "child_process";

export async function readProcDir(command: string): Promise<string[]> {
  try {
    const initial_read: string[] = await new Promise((resolve, reject) =>
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout?.split("\n")?.filter((n) => !isNaN(+n)));
      })
    );
    return initial_read;
  } catch {
    return null;
  }
}

