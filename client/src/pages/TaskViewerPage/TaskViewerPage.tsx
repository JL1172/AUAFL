import { useEffect } from "react";
import "./taskviewer-page.scss";
import { useTask } from "./hooks/useTask";
import FilterContainer from "./components/FilterContainer";
import ColumnNames from "./components/ColumnNames";
import ProcessRows from "./components/ProcessRows";
import TaskContainerHeader from "./components/TaskContainerHeader";
export interface ProcessObj {
  Name: string;
  Pid: string;
  VmPeak: string;
  VmRSS: string;
  RssAnon: string;
  Threads: string;
  VmSize: string;
  VmSwap: string;
  cpuUtilization: number;
  memoryUtilization: string;
}
export interface Process {
  [key: string]: ProcessObj[] | number | boolean | string;
  memory: number;
  currSwap: number;
  currRam: number;
  memPeakAverage: number;
  averageCpuTime: number;
  displayCpuTime: boolean;
  averageThreads: number;
  processName: string;
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
          </div>
          <div className="process-list">
            <ColumnNames
              filtersState={filtersState}
              renderHighlight={renderHighlight}
            />
            <ProcessRows
              tasks={tasks}
              renderHighlight={renderHighlight}
              filtersState={filtersState}
            />
          </div>
        </div>
      </div>
    )
  );
}
