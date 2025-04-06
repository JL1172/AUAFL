import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { killProcess } from "./kill-process/index.ts";
import { viewTasks } from "./task-viewer/index.ts";
const server = express();
const port = 4000;

server.use(express.json());
server.use(morgan("combined"));
server.use(cors());
server.use(helmet());

server.post("/process", async (req: Request, res: Response, next) => {
  try {
    const listOfProcesses = await viewTasks(
      req?.body?.previousProcArr,
      req?.body?.filters
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
