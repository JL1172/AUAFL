import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Process } from "../pages/TaskViewerPage/TaskViewerPage";
import { AUAFLAxiosInstance } from "../utils/axios-utils/axios-instance";

export type TaskViewerContext = {
  watchStatus: boolean;
  setWatchStatus: (n: boolean) => void;
  tasks: Process[];
  intervalRef: React.RefObject<number>;
  fetchTasks: () => Promise<void>;
  viewFilters: boolean;
  setViewFilters: (n: boolean) => void;
  filters: React.RefObject<string[]>;
  filtersState: string[];
  setFiltersState: (n: string[]) => void;
  renderHighlight: (n: string, o: string, p: string) => string;
  killProcess: (process: Process) => Promise<void>;
  setTaskToKill: React.Dispatch<React.SetStateAction<Process | null>>;
  taskToKill: Process | null;
  pollingIntervalRef: React.RefObject<HTMLInputElement | null>;
  intervalState: number;
  loading: boolean;
  taskKilled: boolean;
  setIntervalState: (n: number) => void;
};
//eslint-disable-next-line
export const TaskViewerContext = createContext<TaskViewerContext | null>(null);

export const TaskViewerProvider = ({ children }: { children: React.ReactNode }) => {
  const [watchStatus, setWatchStatus] = useState(true);
  const [tasks, setTasks] = useState([]);
  const intervalRef = useRef(-1);
  const previousTaskRef = useRef(null);
  const sendPreviousProcArr = useRef(false);
  const [taskToKill, setTaskToKill] = useState<Process | null>(null);
  const [viewFilters, setViewFilters] = useState(false);
  const [intervalState, setIntervalState] = useState(1000);
  const pollingIntervalRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtersState, setFiltersState] = useState([
    "totalCpuUtilization",
    "desc",
  ]);
  const filters = useRef(["totalCpuUtilization", "desc"]);
  const [taskKilled, setTaskKilled] = useState(false);
  const axiosInsance = useMemo(() => {
    return AUAFLAxiosInstance.getInstance();
  }, []);
  const fetchTasks = useCallback(async () => {
    if (axiosInsance) {
      if (sendPreviousProcArr?.current) {
        const res = await axiosInsance.post("/process", {
          previousProcArr: previousTaskRef.current,
          filters: filters.current,
          pollingInterval: intervalState
        });
        setTasks(res?.data?.processes);
        previousTaskRef.current = res?.data?.processes;
      } else {
        const res = await axiosInsance.post("process", {
          previosProcArr: undefined,
          filters: filters.current,
          pollingInterval: intervalState
        });
        setTasks(res?.data?.processes);
        sendPreviousProcArr.current = true;
        previousTaskRef.current = res?.data?.processes;
      }
    }
  }, [axiosInsance, intervalState]);
  const renderHighlight = useCallback(
    (orderState: string, filterState: string, expectedFilterState: string) => {
      if (orderState === "desc" && filterState === expectedFilterState) {
        return "highlight";
      } else if (orderState === "asc" && filterState === expectedFilterState) {
        return "highlight-green";
      }
      return "";
    },
    []
  );
  const killProcess = useCallback(
    async (process: Process) => {
      setLoading(true);
      try {
        await axiosInsance.patch("/kill-process", { processToKill: process });
        setTaskToKill(null);
        setTaskKilled(true);
        setTimeout(() => {
          setTaskKilled(false);
        }, 1000);
      } catch {
        console.error("Error killing process");
        alert("Error killing process");
      } finally {
        setLoading(false);
      }
    },
    [axiosInsance]
  );
  return (
    <TaskViewerContext.Provider
      value={{
        loading,
        fetchTasks,
        taskKilled,
        watchStatus,
        setWatchStatus,
        tasks,
        intervalRef,
        viewFilters,
        setViewFilters,
        filtersState,
        setFiltersState,
        filters,
        renderHighlight,
        killProcess,
        taskToKill,
        setTaskToKill,
        setIntervalState,intervalState,pollingIntervalRef
      }}
    >
      {children}
    </TaskViewerContext.Provider>
  );
};
//eslint-disable-next-line
export const useTask = () => useContext(TaskViewerContext);
