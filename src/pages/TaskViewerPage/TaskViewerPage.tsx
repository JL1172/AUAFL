import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import "./taskviewer-page.scss";
import axios from "axios";
import { CiPause1 } from "react-icons/ci";
import { RxResume } from "react-icons/rx";
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
interface Process {
  [key: string]: ProcessObj | number;
  memory: number;
  currSwap: number;
  currRam: number;
  memPeakAverage: number;
}
export default function TaskViewerPage() {
  const [watchStatus, setWatchStatus] = useState(true);
  const [tasks, setTasks] = useState([]);
  const intervalRef = useRef(-1);
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:4000/process");
  setTasks([])
    setTasks(res?.data?.processes);
  };
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
  }, [watchStatus]);
  console.log(tasks)
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
            <h6>Mem Peak</h6>
            <h6>Curr Ram</h6>
            <h6>Curr Swap</h6>
          </div>
          <div className="process-list">
            {tasks?.map((n: Process, i) => {
              const name = Object.keys(n)?.[0];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const processArray: any = n?.[name];

              return (
                <div className="row__" key={i}>
                  <div className="first--">{name}</div>
                  <div className="field">{n?.memory.toFixed(10)}</div>

                  <div className="field">{}</div>
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
