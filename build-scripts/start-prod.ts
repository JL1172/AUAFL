import fs from "fs";
import path from "path";

function remove_build(path: string, build_step: string) {
  console.log(`Checking ${build_step} build... \n`);
  if (fs.existsSync(path)) {
    console.log(`Removing ${build_step} build... \n`);
    fs.rmdirSync(path, { recursive: true });
    console.log(`${build_step} build removed... \n`);
  } else console.log(`No ${build_step} build found... \n`);
}

function build_script() {
  const buildsteps = [
    [path.resolve("dist-client"), "CLIENT"],
    [path.resolve("dist-server"), "SERVER"],
  ] as const;
  let active = 0;
  try {
    const len = buildsteps?.length;
    for (let i = 0; i < len; i++) {
      active = i;
      remove_build(buildsteps[i][0], buildsteps[i][1]);
    }
  } catch (err) {
    console.error(`Error in build step: [${buildsteps[active][1]}]... \n`, err);
  }
}
build_script();
