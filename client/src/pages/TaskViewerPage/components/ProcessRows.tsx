import { useMemo } from "react";
import { Process, ProcessObj } from "../TaskViewerPage";
interface Props {
  renderHighlight?: (n: string, o: string, p: string) => string;
  filtersState?: string[];
  tasks?: Process[];
  setTaskToKill?: React.Dispatch<React.SetStateAction<Process | null>>;
  taskToKill?: Process | null;
  renderOne: boolean;
}
export default function ProcessRows({
  renderHighlight,
  filtersState,
  tasks,
  setTaskToKill,
  taskToKill,
  renderOne,
}: Props) {
  const rowLayout = useMemo(() => {
    return [
      {
        hightLightKey: "Name",
        presentation: (val: Process) => val.processName,
      },
      {
        hightLightKey: "memory",
        presentation: (val: Process) => `${val?.memory?.toFixed(10)}%`,
      },
      {
        hightLightKey: "averageCpuTime",
        presentation: (val: Process) =>
          val?.displayCpuTime && `${(val?.averageCpuTime ?? 0).toFixed(10)}%`,
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
      {renderOne ? (
        <div className="row__">
          {rowLayout.map((n, i) => {
            return (
              <div
                key={i}
                className={`field ${renderHighlight?.(
                  filtersState?.[1] || "",
                  filtersState?.[0] || "",
                  n?.hightLightKey
                )}`}
              >
                {n?.presentation(tasks?.[0] as Process)}
              </div>
            );
          })}
        </div>
      ) : (
        tasks?.map((task, idx) => {
          return (
            <div
              onClick={() => {
                setTaskToKill?.(task);
              }}
              className={`row__ ${
                taskToKill?.processName === task.processName ? "kill-queue" : ""
              }`}
              key={idx}
            >
              {rowLayout.map((n, i) => {
                return (
                  <div
                    key={i}
                    className={`field ${renderHighlight?.(
                      filtersState?.[1] || "",
                      filtersState?.[0] || "",
                      n?.hightLightKey
                    )}`}
                  >
                    {n?.presentation(task)}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </>
  );
}
