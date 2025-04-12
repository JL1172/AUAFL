import { useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Props {
  filtersState: string[];
  renderHighlight: (n: string, o: string, p: string) => string;
  filters: React.RefObject<string[]>;
  setFiltersState: (n: string[]) => void;
}

export default function ColumnNames({
  filtersState,
  renderHighlight,
  filters,
  setFiltersState,
}: Props) {
  const colNames = useMemo(() => {
    return [
      {
        label: "Process Name",
        key: "Name",
        tooltip: "The name of the process",
      },
      {
        label: "Memory %",
        key: "totalMemoryUtilization",
        tooltip:
          "The total memory utilization of VmRSS and the physical RAM size across all processes with this name.",
      },
      {
        label: "CPU %",
        key: "totalCpuUtilization",
        tooltip: "The CPU utilization across all processes with this name.",
      },
      { label: "PID", key: "", tooltip: "Process ID" },
      {
        label: "Threads",
        key: "totalThreads",
        tooltip:
          "The number of concurrent workers or execution paths spawned by this task. Useful for identifying parallel or multi-step operations.",
      },
      {
        label: "VmPeak",
        key: "totalVmPeak",
        tooltip:
          "Peak virtual memory used by the task (includes all mapped memory, even if not resident). Useful for detecting memory spikes.",
      },
      {
        label: "VmRSS",
        key: "totalVmRSS",
        tooltip:
          "Resident Set Size—actual physical memory used (RAM currently occupied).",
      },
      {
        label: "VmSwap",
        key: "totalSwap",
        tooltip:
          "Amount of virtual memory swapped out to disk. High values may indicate memory pressure or poor performance.",
      },
    ];
  }, []);
  return (
    <div className="col-names">
      {colNames?.map((n, i) => {
        return (
          <h6
            onClick={() => {
              const prevState = [...filtersState];
              if (prevState[0] === n?.key && prevState?.[1] === "desc") {
                prevState[1] = "asc";
              } else if (prevState[0] === n?.key && prevState?.[1] === "asc") {
                prevState[1] = "desc";
              } else {
                prevState[0] = n?.key;
                prevState[1] = "desc";
              }
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            key={i}
            className={`${
              n?.key &&
              renderHighlight(filtersState[1], filtersState[0], n?.key)
            } ${
              renderHighlight(filtersState[1], filtersState[0], n?.key)
                ? "bolden"
                : ""
            } `}
            title={n?.tooltip}
          >
            {n?.label}
            {  n?.key && renderHighlight(filtersState[1], filtersState[0], n?.key) ===
            "highlight" ? (
              <FaChevronDown />
            ) :   n?.key && renderHighlight(filtersState[1], filtersState[0], n?.key) ===
              "highlight-green" ? (
              <FaChevronUp />
            ) : (
              ""
            )}
          </h6>
        );
      })}
    </div>
  );
}
