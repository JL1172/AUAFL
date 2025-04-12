import { memo } from "react";
import { Process } from "../TaskViewerPage";
export interface Row_Layout {
  presentation: (n: Process) => string | number | boolean;
  hightLightKey: string;
}
export interface Row_Data {
  tasks: Process[];
  rowLayout: Row_Layout[];
  filtersState?: string[];
  renderHighlight?: (n: string, o: string, p: string) => string;
  loading?: boolean;
  setTaskToKill?: React.Dispatch<React.SetStateAction<Process | null>>;
  taskToKill?: Process | null;
}
export default memo(function ProcessRow({
  index,
  data,
  style,
}: {
  data: Row_Data;
  index: number;
  style: React.CSSProperties | undefined;
}) {
  const {
    tasks,
    rowLayout,
    filtersState,
    renderHighlight,
    loading,
    setTaskToKill,
    taskToKill,
  } = data;
  const task = tasks[index];

  return (
    <div
      style={style}
      title={
        (task as Process)?.isSystemProcess ? "This is a system process" : ""
      }
      onClick={() => {
        if (!loading) {
          setTaskToKill?.(task);
        }
      }}
      className={`row__ ${
        taskToKill?.processName === task.processName ? "kill-queue" : ""
      } ${(task as Process)?.isSystemProcess ? "system-proc" : ""}`}
      key={index}
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
});
