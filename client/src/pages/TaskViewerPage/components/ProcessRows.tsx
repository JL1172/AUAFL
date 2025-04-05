import { useMemo } from "react";
import { Process, ProcessObj } from "../TaskViewerPage";
interface Props {
  renderHighlight: (n: string, o: string, p: string) => string;
  filtersState: string[];
  tasks: Process[];
}
export default function ProcessRows({
  renderHighlight,
  filtersState,
  tasks,
}: Props) {
  const rowLayout = useMemo(() => {
    return [
      {
        hightLightKey: "Name",
        presentation: (val: Process) => val.processName,
      },
      {
        hightLightKey: "memory",
        presentation: (val: Process) => val?.memory?.toFixed(10),
      },
      {
        hightLightKey: "averageCpuTime",
        presentation: (val: Process) =>
          val?.displayCpuTime && (val?.averageCpuTime ?? 0).toFixed(10),
      },
      {
        hightLightKey: "PID",
        presentation: (val: Process) =>
          (val[val.processName] as ProcessObj[])[0]?.Pid,
      },
      {
        hightLightKey: "Threads",
        presentation: (val: Process) => val?.averageThreads ?? 0,
      },
      {
        hightLightKey: "memPeakAverage",
        presentation: (val: Process) => `${val?.memPeakAverage} KB`,
      },
      {
        hightLightKey: "currRam",
        presentation: (val: Process) => `${val?.currRam} KB`,
      },
      {
        hightLightKey: "currSwap",
        presentation: (val: Process) => `${val?.currSwap} KB`,
      },
    ];
  }, []);

  return (
    <>
      {tasks.map((task, idx) => {
        return <div className="row__" key={idx}>
          {rowLayout.map((n, i) => {
            return (
              <div
                key={i}
                className={`field ${renderHighlight(
                  filtersState[1],
                  filtersState[0],
                  n?.hightLightKey
                )}`}
              >
                {n?.presentation(task)}
              </div>
            );
          })}
        </div>;
      })}
    </>
  );
}
