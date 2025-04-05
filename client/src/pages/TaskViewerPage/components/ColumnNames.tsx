import { useMemo } from "react";

interface Props {
  filtersState: string[];
  renderHighlight: (n:string,o:string,p:string) => string;
}

export default function ColumnNames({ filtersState, renderHighlight }: Props) {
  
  const colNames = useMemo(() => {
    return [
      {
        label: "Process Name",
        key: "Name",
        tooltip: "The name of the process",
      },
      {
        label: "Memory %",
        key: "memory",
        tooltip:
          "The average memory utilization percentage of VmRSS and the physical RAM size across all processes with this name",
      },
      {
        label: "CPU %",
        key: "averageCpuTime",
        tooltip:
          "The average CPU utilization across all processes with this name. Each process's CPU utilization is individually calculated then averaged.",
      },
      { label: "PID", key: "", tooltip: "Process ID" },
      {
        label: "Threads",
        key: "Threads",
        tooltip:"The number of concurrent workers or execution paths spawned by this task. Useful for identifying parallel or multi-step operations."
      },
      {
        label: "VmPeak",
        key: "memPeakAverage",
        tooltip:
          "Peak virtual memory used by the task (includes all mapped memory, even if not resident). Useful for detecting memory spikes.",
      },
      {
        label: "VmRSS",
        key: "currRam",
        tooltip:
          "Resident Set Size—actual physical memory used (RAM currently occupied).",
      },
      {
        label: "VmSwap",
        key: "currSwap",
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
              key={i}
              className={`${renderHighlight(
                filtersState[1],
                filtersState[0],
                n?.key
              )}`}
              title={n?.tooltip}
            >
                {n?.label}
            </h6>
          );
        })}
      </div>
  );
}
