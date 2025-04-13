import { useEffect } from "react";
import "./taskviewer-page.scss";
import { useTask } from "../../contexts/TaskViewerContext";
import FilterContainer from "./components/FilterContainer";
import ColumnNames from "./components/ColumnNames";
import ProcessRows from "./components/ProcessRows";
import TaskContainerHeader from "./components/TaskContainerHeader";
import KillTaskQueue from "./components/KillTaskQueue";
export interface rawCpuTimeObj {
  utime: number;
  stime: number;
  timestamp: number;
}
export interface ProcessObj {
  Name: string;
  Pid: number;
  VmPeak: number;
  VmRSS: number;
  Threads: number;
  VmSize: number;
  VmSwap: number;
  cpuUtilization: number;
  memoryUtilization: number;
  rawCpuTime: rawCpuTimeObj | null;
  isSystemProcess: boolean;
  Uid: string;
}

export interface Process {
  [key: string]: ProcessObj[] | number | boolean | string;
  totalMemoryUtilization: number;
  totalSwap: number;
  totalVmRSS: number;
  PidToDisplay: number;
  totalVmPeak: number;
  totalCpuUtilization: number;
  displayCpuTime: boolean;
  totalThreads: number;
  processName: string;
  isSystemProcess: boolean;
}
export default function TaskViewerPage() {
  const { fetchTasks, watchStatus, tasks, intervalRef, pollingIntervalRef, intervalState } = useTask()!;
  useEffect(() => {
    if (watchStatus) {
      intervalRef.current = Number(
        setInterval(() => {
          fetchTasks();
        }, Number(pollingIntervalRef?.current?.value)) || 1000
      );
    } 
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    //eslint-disable-next-line
  }, [watchStatus,intervalState ]);
  return (
    <div className="task--page--container--">
      <div className="task-container">
        <div className="top-row--">
          <TaskContainerHeader />
          <FilterContainer />
          <KillTaskQueue />
        </div>
        <div className="process-list">
          <ColumnNames />
          {tasks?.length > 0 && <ProcessRows renderOne={false} />}
        </div>
      </div>
    </div>
  );
}
