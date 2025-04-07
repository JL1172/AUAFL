import { exec } from "child_process";

export async function readProcDir(command: string): Promise<string[] | null>  {
  try {
    const initial_read: string[] = await new Promise((resolve, reject) =>
      exec(command, (error, stdout) => {
        if (error) reject(error);
        else resolve(stdout?.split("\n")?.filter((n) => !isNaN(+n)));
      })
    );
    return initial_read;
  } catch {
    return null;
  }
}

