import { useCallback, useMemo, useRef, useState } from "react";
import { AUAFLAxiosInstance } from "../../../utils/axios-utils/axios-instance";
import { Process } from "../TaskViewerPage";

type useTaskHookType = {
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
};

export const useTask = (): useTaskHookType => {
  const [watchStatus, setWatchStatus] = useState(true);
  const [tasks, setTasks] = useState([]);
  const intervalRef = useRef(-1);
  const previousTaskRef = useRef(null);
  const sendPreviousProcArr = useRef(false);
  const [taskToKill, setTaskToKill] = useState<Process | null>(null);
  const [viewFilters, setViewFilters] = useState(false);
  const [filtersState, setFiltersState] = useState(["averageCpuTime", "desc"]);
  const filters = useRef(["averageCpuTime", "desc"]);
  const axiosInsance = useMemo(() => {
    return AUAFLAxiosInstance.getInstance();
  }, []);
  const fetchTasks = useCallback(async () => {
    if (axiosInsance) {
      if (sendPreviousProcArr?.current) {
        const res = await axiosInsance.post("/process", {
          previousProcArr: previousTaskRef.current,
          filters: filters.current,
        });
        setTasks(res?.data?.processes);
        previousTaskRef.current = res?.data?.processes;
      } else {
        const res = await axiosInsance.post("process", {
          previosProcArr: undefined,
          filters: filters.current,
        });
        setTasks(res?.data?.processes);
        sendPreviousProcArr.current = true;
        previousTaskRef.current = res?.data?.processes;
      }
    }
  }, [axiosInsance]);
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
      try {
        await axiosInsance.patch("/kill-pid", process);
      } catch {
        console.error("Error killing process");
      }
    },
    [axiosInsance]
  );
  return {
    fetchTasks,
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
  };
};
