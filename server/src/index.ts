import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { killProcess } from "./kill-process/index.js";
import { view_system_processes as viewTasks } from "./task-viewer/index.js";
import { view_sensors } from "./sensors/view-cpu-temp.js";
const server = express();
const port = 4000;

server.use(express.json());
server.use(morgan("combined"));
server.use(cors());
server.use(helmet());

server.post("/process", async (req: Request, res: Response, next) => {
  try {
    const listOfProcesses = await viewTasks(
      req?.body?.filters,
      req?.body?.pollingInterval,
      req?.body?.previousProcArr,
    );
    res.status(200).json({ processes: listOfProcesses });
  } catch (err: unknown) {
    next(err);
  }
});

server.get("/general-info", (req: Request, res: Response, next) => {
  try {
    res.status(200).json({ appName: "AUAFL" });
  } catch (err) {
    {
      next(err);
    }
  }
});
server.patch("/kill-process", async (req: Request, res: Response, next) => {
  try {
    if (!req?.body?.processToKill) {
      const err = new Error(
        'Must have process to kill appended to req body as "processToKill"'
      );
      (err as any).status = 422;
      return next(err);
    } else {
      const status = await killProcess(req?.body?.processToKill);
      res.status(200).json({ message: status });
    }
  } catch (err) {
    {
      next(err);
    }
  }
});
server.get("/sensors", async (req: Request, res: Response, next) => {
  try {
    const sensor_information = await view_sensors();
    if (sensor_information === null) {
      const err = { message: "Error reading machine sensors", status: 500 };
      return next(err);
    } else {
      res.status(200).json({ data: sensor_information });
    }
  } catch (err) {
    next(err);
  }
});
//eslint-disable-next-line
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status ?? 500).json({
    error: true,
    message: err.message || "Something went wrong!",
  });
});
server.listen(port, () => {
  console.log("Server running at port: " + port);
});
