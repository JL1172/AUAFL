import { useMemo } from "react";
import { Process, ProcessObj } from "../TaskViewerPage";
interface Props {
  renderHighlight?: (n: string, o: string, p: string) => string;
  filtersState?: string[];
  tasks?: Process[];
  setTaskToKill?: React.Dispatch<React.SetStateAction<Process | null>>;
  taskToKill?: Process | null;
  renderOne: boolean;
  loading: boolean;
}
export default function ProcessRows({
  renderHighlight,
  filtersState,
  tasks,
  setTaskToKill,
  taskToKill,
  renderOne,
  loading,
}: Props) {
  const rowLayout = useMemo(() => {
    return [
      {
        hightLightKey: "Name",
        presentation: (val: Process) => val.processName,
      },
      {
        hightLightKey: "totalMemoryUtilization",
        presentation: (val: Process) =>
          `${val?.totalMemoryUtilization?.toFixed(2)}%`,
      },
      {
        hightLightKey: "totalCpuUtilization",
        presentation: (val: Process) =>
          val?.displayCpuTime &&
          `${(val?.totalCpuUtilization ?? 0).toFixed(2)}%`,
      },
      {
        hightLightKey: "PID",
        presentation: (val: Process) =>
          (val[val.processName] as ProcessObj[])[0]?.Pid,
      },
      {
        hightLightKey: "Threads",
        presentation: (val: Process) => val?.totalThreads ?? 0,
      },
      {
        hightLightKey: "totalVmPeak",
        presentation: (val: Process) => `${val?.totalVmPeak} KB`,
      },
      {
        hightLightKey: "totalVmRSS",
        presentation: (val: Process) => `${val?.totalVmRSS} KB`,
      },
      {
        hightLightKey: "totalSwap",
        presentation: (val: Process) => `${val?.totalSwap} KB`,
      },
    ];
  }, []);

  return (
    <>
      {renderOne ? (
        <div
          title={
            (tasks?.[0] as Process)?.isSystemProcess
              ? "This is a system process"
              : ""
          }
          className={`row__ ${
            (tasks?.[0] as Process)?.isSystemProcess ? "system-proc" : ""
          }`}
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
                {n?.presentation(tasks?.[0] as Process)}
              </div>
            );
          })}
        </div>
      ) : (
        tasks?.map((task, idx) => {
          return (
            <div
            title={
              (task as Process)?.isSystemProcess
                ? "This is a system process"
                : ""
            }
              onClick={() => {
                if (!loading) {
                  setTaskToKill?.(task);
                }
              }}
              className={`row__ ${
                taskToKill?.processName === task.processName ? "kill-queue" : ""
              } ${(task as Process)?.isSystemProcess ? "system-proc" : ""}`}
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
