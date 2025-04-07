import { useEffect } from "react";
import "./taskviewer-page.scss";
import { useTask } from "./hooks/useTask";
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
  const {
    fetchTasks,
    watchStatus,
    setWatchStatus,
    tasks,
    intervalRef,
    viewFilters,
    filters,
    filtersState,
    setViewFilters,
    setFiltersState,
    renderHighlight,
    taskToKill,
    setTaskToKill,
    killProcess,
    loading,
  } = useTask();
  useEffect(() => {
    if (watchStatus) {
      intervalRef.current = setInterval(() => {
        fetchTasks();
      }, 1000);
    } else if (intervalRef.current !== -1) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    //eslint-disable-next-line
  }, [watchStatus]);
  return (
    tasks?.length && (
      <div className="task--page--container--">
        <div className="task-container">
          <div className="top-row--">
            <TaskContainerHeader
              setViewFilters={setViewFilters}
              setWatchStatus={setWatchStatus}
              watchStatus={watchStatus}
              viewFilters={viewFilters}
            />
            <FilterContainer
              viewFilters={viewFilters}
              filtersState={filtersState}
              setViewFilters={setViewFilters}
              filters={filters}
              setFiltersState={setFiltersState}
            />
            <KillTaskQueue
              killProcess={killProcess}
              loading={loading}
              tasks={tasks}
              renderHighlight={renderHighlight}
              filtersState={filtersState}
              setTaskToKill={setTaskToKill}
              taskToKill={taskToKill}
            />
          </div>
          <div className="process-list">
            <ColumnNames
              filtersState={filtersState}
              renderHighlight={renderHighlight}
            />
            <ProcessRows
              loading={loading}
              renderOne={false}
              tasks={tasks}
              renderHighlight={renderHighlight}
              filtersState={filtersState}
              setTaskToKill={setTaskToKill}
              taskToKill={taskToKill}
            />
          </div>
        </div>
      </div>
    )
  );
}
