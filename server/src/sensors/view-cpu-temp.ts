import fs from "fs";
async function read_dir(path: string): Promise<string[] | undefined> {
  return (await fs.promises.readdir(path, { encoding: "utf-8" }))?.filter((n) =>
    /thermal_zone/i.test(n)
  );
}
async function read_file(
  path: string
): Promise<{ type: string; raw_temp: number; c: number; f: number } | null> {
  const type = (
    await fs.promises.readFile(`${path}/type`, { encoding: "utf-8" })
  ).trim();
  const raw_temp = (
    await fs.promises.readFile(`${path}/temp`, { encoding: "utf-8" })
  ).trim();
  if (!type || !raw_temp) {
    return null;
  }
  return {
    type,
    raw_temp: +raw_temp,
    c: +raw_temp / 1000,
    f: Math.floor((9 / 5) * (+raw_temp / 1000) + 32),
  };
}
export async function view_sensors(): Promise<
  | {
      type: string;
      raw_temp: number;
      c: number;
      f: number;
      sensor_name: string;
    }[]
  | null
> {
  try {
    const thermals_path = `/sys/class/thermal`;
    const thermal_zones = await read_dir(thermals_path);
    if (!thermal_zones) {
      console.error("Unable to retrieve thermal zones...");
      return null;
    }

    const len = thermal_zones.length;
    const sensors: {
      type: string;
      raw_temp: number;
      c: number;
      f: number;
      sensor_name: string;
    }[] = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      const currThermalZone = thermal_zones[i];
      const res = await read_file(`${thermals_path}/${currThermalZone}`);
      if (res === null) {
        console.error(`Error reading from ${currThermalZone}...`);
        return null;
      } else {
        sensors[i] = { ...res, sensor_name: currThermalZone };
      }
    }
    if (sensors?.length === 0) {
      console.error("Error, no thermal data detected...");
      return null;
    }
    return sensors;
  } catch (err) {
    console.error("Error in view_sensors function: ", err);
    return null;
  }
}
