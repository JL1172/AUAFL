import { useEffect} from "react";
import "./taskviewer-page.scss";
import { CiPause1 } from "react-icons/ci";
import { RxResume } from "react-icons/rx";
import { useTask } from "./hooks/useTask";
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
  const { fetchTasks, watchStatus, setWatchStatus, tasks, intervalRef } =
    useTask();
  useEffect(() => {
    if (watchStatus) {
      intervalRef.current = setInterval(() => {
        fetchTasks();
        console.log("fetched");
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
            System Processes{" "}
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
          <div className="col-names">
            <h6>Process Name</h6>
            <h6>Memory %</h6>
            <h6>Cpu %</h6>
            <h6>Pid</h6>
            <h6>Threads</h6>
            <h6>VmPeak</h6>
            <h6>VmRSS</h6>
            <h6>VmSwap</h6>
          </div>
          <div className="process-list">
            {tasks?.map((n: Process, i) => {
              const name = Object.keys(n)?.[0];
              const processArray: any = n?.[name];
              return (
                <div className="row__" key={i}>
                  <div className="first--">{name}</div>
                  <div className="field">{n?.memory.toFixed(10)}</div>

                  <div className="field">
                    {n?.displayCpuTime && (n.averageCpuTime ?? 0).toFixed(10)}%
                  </div>
                  <div className="field">{processArray?.[0]?.Pid}</div>
                  <div className="field">{processArray?.[0]?.Threads}</div>
                  <div className="field">{n?.memPeakAverage} KB</div>
                  <div className="field">{n?.currRam} KB</div>
                  <div className="field">{n?.currSwap} KB</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
}
