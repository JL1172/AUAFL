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
const fs_1 = require("fs");
let mainWindow = null;
let backendProcess = null;
function isDev() {
    return process.env.NODE_ENV === "development";
}
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1024,
        height: 768,
        minimizable: true,
        maximizable: true,
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5173");
    }
    else {
        const htmlPath = path.join(__dirname, "..", "dist-client", "index.html");
        console.log("Loading HTML from:", htmlPath);
        mainWindow.loadFile(htmlPath);
    }
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
function startBackend() {
    let backendScript;
    const command = isDev() ? "tsx" : "node";
    if (isDev()) {
        backendScript = path.resolve(__dirname, "..", "server", "src", "index.ts");
    }
    else {
        const basePath = process.resourcesPath;
        const unpackedBackendPath = path.join(basePath, "app.asar.unpacked", "dist-server", "index.js");
        backendScript = (0, fs_1.existsSync)(unpackedBackendPath)
            ? unpackedBackendPath
            : path.join(__dirname, "..", "dist-server", "index.js");
        console.log("Starting backend from:", backendScript);
        console.log("File exists:", (0, fs_1.existsSync)(backendScript));
    }
    console.log(`Spawning ${command} with script ${backendScript}`);
    backendProcess = (0, child_process_1.spawn)(command, [backendScript], {
        stdio: "inherit"
    });
    backendProcess.on("error", (error) => {
        console.error("Failed to start backend process:", error);
    });
}
electron_1.app.whenReady().then(() => {
    console.log("App is ready, starting backend...");
    startBackend();
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (backendProcess) {
        backendProcess.kill();
    }
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
