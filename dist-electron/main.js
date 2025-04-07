"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts
const electron_1 = require("electron");
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
let mainWindow = null;
let backendProcess = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
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
    }
    else {
        // In production, load the built HTML file from your client build output.
        const htmlPath = path.join( 'dist-client', "index.html");
        const fileUrl = `${htmlPath}`;
        mainWindow.loadFile(fileUrl);
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
function startBackend() {
    let backendScript;
    let command;
    if (process.env.NODE_ENV === 'development') {
        // In development, run the server code using tsx (make sure tsx is installed as a dev dependency)
        command = 'tsx';
        // Point to your uncompiled Express API entry file.
        backendScript = path.resolve(__dirname, '..', 'server', 'src', 'index.ts');
    }
    else {
        // In production, run the compiled backend code.
        command = 'node';
        // Your tsc build outputs to ./dist/server preserving the folder structure,
        // so the entry file is at: dist/server/src/index.js
        // backendScript = path.resolve(__dirname, "..", 'dist-server', 'index.js');
        //run time 
        backendScript = path.resolve('dist-server', 'index.js');
    }
    backendProcess = (0, child_process_1.spawn)(command, [backendScript], { stdio: 'inherit' });
    backendProcess.on('error', (error) => {
        console.error('Failed to start backend process:', error);
    });
}
electron_1.app.whenReady().then(() => {
    // Start the Express backend first.
    startBackend();
    // Then create the Electron browser window.

    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            startBackend();
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (backendProcess) {
        backendProcess.kill();
    }
    // On Windows and Linux, quit the app when all windows are closed.
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
