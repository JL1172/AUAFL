import { CiCircleRemove } from "react-icons/ci";
import { Process } from "../TaskViewerPage";
import ProcessRows from "./ProcessRows";
import { IoWarningOutline } from "react-icons/io5";
interface Props {
  renderHighlight?: (n: string, o: string, p: string) => string;
  filtersState?: string[];
  tasks?: Process[];
  setTaskToKill?: React.Dispatch<React.SetStateAction<Process | null>>;
  taskToKill?: Process | null;
  loading: boolean;
  killProcess: (task: Process) => Promise<void>;
}
export default function KillTaskQueue({
  taskToKill,
  tasks,
  loading,
  setTaskToKill,
  renderHighlight,
  killProcess,
  filtersState,
}: Props) {
  return (
    <div
      className={`${
        taskToKill ? "render-task-kill-queue" : "hide-task-kill-queue"
      }`}
    >
      <div className="task-to-kill-heading">
        <h6>Task To Kill Queue</h6>
        <div
          onClick={() => {
            if (!loading) setTaskToKill?.(null);
          }}
          className="remove-icon"
          title="Remove task from task kill queue"
        >
          <CiCircleRemove
            style={{ width: "1.6rem", height: "1.6rem" }}
            color="green"
          />
        </div>
        <button
          onClick={() => {
            if (!loading) {
              killProcess(
                tasks?.find(
                  (task) => task.processName === taskToKill?.processName
                ) as Process
              );
            }
          }}
        >
          Kill Task
        </button>
        {(tasks?.find(
              (task) => task.processName === taskToKill?.processName
            ) ?? taskToKill)?.isSystemProcess && <span className="warning"><IoWarningOutline style={{height: "1.5rem", width: "1.5rem", color: "red"}} /> Warning, this process is a system process</span>}
      </div>
      {taskToKill && (
        <ProcessRows
          renderOne={true}
          loading={loading}
          tasks={[
            tasks?.find(
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
  );
}
