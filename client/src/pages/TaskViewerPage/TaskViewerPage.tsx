import { useEffect } from "react";
import "./taskviewer-page.scss";
import { useTask } from "./hooks/useTask";
import FilterContainer from "./components/FilterContainer";
import ColumnNames from "./components/ColumnNames";
import ProcessRows from "./components/ProcessRows";
import TaskContainerHeader from "./components/TaskContainerHeader";
import { CiCircleRemove } from "react-icons/ci";
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
    taskToKill,
    setTaskToKill,
    killProcess,
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
            <div
              className={
                taskToKill ? "render-task-kill-queue" : "hide-task-kill-queue"
              }
            >
              <div className="task-to-kill-heading">
                <h6>Task To Kill Queue</h6>
                <div
                  onClick={() => setTaskToKill(null)}
                  className="remove-icon"
                  title="Remove task from task kill queue"
                >
                  <CiCircleRemove
                    style={{ width: "1.6rem", height: "1.6rem" }}
                    color="green"
                  />
                </div>
                <button onClick={() => {
                  killProcess(taskToKill as Process);
                }}>Kill Task</button>
              </div>
              {taskToKill && (
                <ProcessRows
                  renderOne={true}
                  tasks={[
                    tasks.find(
                      (task) => task.processName === taskToKill.processName
                    ) ?? taskToKill,
                  ]}
                  renderHighlight={renderHighlight}
                  filtersState={filtersState}
                  setTaskToKill={setTaskToKill}
                  taskToKill={taskToKill}
                />
              )}
            </div>
          </div>
          <div className="process-list">
            <ColumnNames
              filtersState={filtersState}
              renderHighlight={renderHighlight}
            />
            <ProcessRows
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
