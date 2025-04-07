// main.ts
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

let mainWindow: BrowserWindow | null = null;
let backendProcess: ChildProcess | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minimizable: true,
    maximizable: true,
    webPreferences: {
      // No preload script needed
      contextIsolation: true,
      nodeIntegration: false,
    },
  });


  if (process.env.NODE_ENV === 'development') {
    // Load the Vite dev server. Confirm the port matches your vite.config.ts (here 5173).
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // In production, load the built HTML file from your client build output.
    const htmlPath = path.join('dist-client', "index.html");
    const fileUrl = `${htmlPath}`;

    mainWindow.loadFile(fileUrl);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  let backendScript: string;
  let command: string;

  if (process.env.NODE_ENV === 'development') {
    // In development, run the server code using tsx (make sure tsx is installed as a dev dependency)
    command = 'tsx';
    // Point to your uncompiled Express API entry file.
    backendScript = path.resolve(__dirname, '..', 'server', 'src', 'index.ts');
  } else {
    // In production, run the compiled backend code.
    command = 'node';
    // Your tsc build outputs to ./dist/server preserving the folder structure,
    // so the entry file is at: dist/server/src/index.js
    backendScript = path.resolve(__dirname, "..",'dist-server', 'index.js');
  }

  backendProcess = spawn(command, [backendScript], { stdio: 'inherit' });

  backendProcess.on('error', (error) => {
    console.error('Failed to start backend process:', error);
  });
}

app.whenReady().then(() => {
  // Start the Express backend first.
  startBackend();
  // Then create the Electron browser window.
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  // On Windows and Linux, quit the app when all windows are closed.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
