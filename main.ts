// main.ts
import { app, BrowserWindow } from "electron";
import * as path from "path";
import {
  spawn,
  ChildProcess,
  exec,
  ExecException,
  execSync,
} from "child_process";
import { existsSync } from "fs";

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;

function isDev() {
  return process.env.NODE_ENV === "development";
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minimizable: true,
    maximizable: true,
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const htmlPath = path.join(__dirname, "..", "dist-client", "index.html");
    console.log("Loading HTML from:", htmlPath);
    mainWindow.loadFile(htmlPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function startBackend() {
  let backendScript: string;
  let command = isDev() ? "tsx" : "node";

  if (isDev()) {
    backendScript = path.resolve(__dirname, "..", "server", "src", "index.ts");
  } else {
    command = "/home/jacoblang/.nvm/versions/node/v23.3.0/bin/node";
    backendScript =
      "/opt/AUAFL/resources/app.asar.unpacked/dist-server/index.js";
  }

  console.log(`Spawning ${command} with script ${backendScript}`);

  backendProcess = spawn(command, [backendScript], {
    stdio: "inherit",
  });

  backendProcess.on("error", (error) => {
    console.error("Failed to start backend process:", error);
  });
}

app.whenReady().then(() => {
  console.log("App is ready, starting backend...");
  startBackend()
    .then(() => {
      createWindow();
    })
    .catch((err) => console.error(err));

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
