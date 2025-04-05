import { useEffect } from "react";
import "./taskviewer-page.scss";
import { CiPause1 } from "react-icons/ci";
import { RxResume } from "react-icons/rx";
import { useTask } from "./hooks/useTask";
import { IoFilter } from "react-icons/io5";
import FilterContainer from "./components/FilterContainer";
interface ProcessObj {
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
  [key: string]: ProcessObj | number | boolean;
  memory: number;
  currSwap: number;
  currRam: number;
  memPeakAverage: number;
  averageCpuTime: number;
  displayCpuTime: boolean;
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
            <div className="first-top">
              <span
                onClick={() => {
                  setViewFilters(!viewFilters);
                }}
                className="filter--icon"
              >
                <IoFilter />
              </span>
              <h5>System Processes </h5>
              <span
                onClick={() => setWatchStatus(!watchStatus)}
                className="pause"
              >
                <h6>{watchStatus ? "Pause Watch" : "Resume Watch"}</h6>
                {watchStatus ? (
                  <CiPause1 style={{ width: "1.5rem" }} />
                ) : (
                  <RxResume style={{ width: "1.5rem" }} />
                )}
              </span>
            </div>
            <FilterContainer
              viewFilters={viewFilters}
              filtersState={filtersState}
              setViewFilters={setViewFilters}
              filters={filters}
              setFiltersState={setFiltersState}
            />
          </div>
          <div className="process-list">
            <div className="col-names">
              <h6
                className={
                  filtersState[1] === "desc" && filtersState[0] === "Name"
                    ? "highlight"
                    : filtersState[1] === "asc" && filtersState[0] === "Name"
                    ? "highlight-green"
                    : ""
                }
              >
                Process Name
              </h6>
              <h6
                className={
                  filtersState[1] === "desc" && filtersState[0] === "memory"
                    ? "highlight"
                    : filtersState[1] === "asc" && filtersState[0] === "memory"
                    ? "highlight-green"
                    : ""
                }
              >
                Memory %
              </h6>
              <h6
                className={
                  filtersState[1] === "desc" &&
                  filtersState[0] === "averageCpuTime"
                    ? "highlight"
                    : filtersState[1] === "asc" &&
                      filtersState[0] === "averageCpuTime"
                    ? "highlight-green"
                    : ""
                }
              >
                Cpu %
              </h6>
              <h6>Pid</h6>
              <h6>Threads</h6>
              <h6
                className={
                  filtersState[1] === "desc" &&
                  filtersState[0] === "memPeakAverage"
                    ? "highlight"
                    : filtersState[1] === "asc" &&
                      filtersState[0] === "memPeakAverage"
                    ? "highlight-green"
                    : ""
                }
              >
                VmPeak
              </h6>
              <h6
                className={
                  filtersState[1] === "desc" && filtersState[0] === "currRam"
                    ? "highlight"
                    : filtersState[1] === "asc" && filtersState[0] === "currRam"
                    ? "highlight-green"
                    : ""
                }
              >
                VmRSS
              </h6>
              <h6
                className={
                  filtersState[1] === "desc" && filtersState[0] === "currSwap"
                    ? "highlight"
                    : filtersState[1] === "asc" &&
                      filtersState[0] === "currSwap"
                    ? "highlight-green"
                    : ""
                }
              >
                VmSwap
              </h6>
            </div>
            {tasks?.map((n: Process, i) => {
              const name = Object.keys(n)?.[0];
              const processArray: any = n?.[name];
              return (
                <div className="row__" key={i}>
                  <div
                    className={`first--  ${
                      filtersState[1] === "desc" && filtersState[0] === "Name"
                        ? "highlight"
                        : filtersState[1] === "asc" &&
                          filtersState[0] === "Name"
                        ? "highlight-green"
                        : ""
                    }`}
                  >
                    {name}
                  </div>
                  <div
                    className={`field ${
                      filtersState[1] === "desc" && filtersState[0] === "memory"
                        ? "highlight"
                        : filtersState[1] === "asc" &&
                          filtersState[0] === "memory"
                        ? "highlight-green"
                        : ""
                    }`}
                  >
                    {n?.memory.toFixed(10)}
                  </div>

                  <div
                    className={`field ${
                      filtersState[1] === "desc" &&
                      filtersState[0] === "averageCpuTime"
                        ? "highlight"
                        : filtersState[1] === "asc" &&
                          filtersState[0] === "averageCpuTime"
                        ? "highlight-green"
                        : ""
                    }`}
                  >
                    {n?.displayCpuTime && (n.averageCpuTime ?? 0).toFixed(10)}%
                  </div>
                  <div className={`field `}>{processArray?.[0]?.Pid}</div>
                  <div className={`field `}>{processArray?.[0]?.Threads}</div>
                  <div
                    className={`field ${
                      filtersState[1] === "desc" &&
                      filtersState[0] === "memPeakAverage"
                        ? "highlight"
                        : filtersState[1] === "asc" &&
                          filtersState[0] === "memPeakAverage"
                        ? "highlight-green"
                        : ""
                    }`}
                  >
                    {n?.memPeakAverage} KB
                  </div>
                  <div
                    className={`field ${
                      filtersState[1] === "desc" &&
                      filtersState[0] === "currRam"
                        ? "highlight"
                        : filtersState[1] === "asc" &&
                          filtersState[0] === "currRam"
                        ? "highlight-green"
                        : ""
                    }`}
                  >
                    {n?.currRam} KB
                  </div>
                  <div
                    className={`field ${
                      filtersState[1] === "desc" &&
                      filtersState[0] === "currSwap"
                        ? "highlight"
                        : filtersState[1] === "asc" &&
                          filtersState[0] === "currSwap"
                        ? "highlight-green"
                        : ""
                    }`}
                  >
                    {n?.currSwap} KB
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}
