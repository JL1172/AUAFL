import { useMemo } from "react";

interface Props {
  viewFilters: boolean;
  filtersState: string[];
  setViewFilters: (n: boolean) => void;
  filters: React.RefObject<string[]>;
  setFiltersState: (n: string[]) => void;
}
export default function FilterContainer({
  viewFilters,
  filtersState,
  setFiltersState,
  filters,
}: Props) {
  const radioArrToMap = useMemo(() => {
    return [
      {
        label: "Name",
        radioGroup: "filter",
        value: "Name",
      },
      {
        label: "Memory %",
        radioGroup: "filter",
        value: "totalMemoryUtilization",
      },
      {
        label: "CPU %",
        radioGroup: "filter",
        value: "totalCpuUtilization",
      },
      {
        label: "VmSwap",
        radioGroup: "filter",
        value: "totalSwap",
      },
      {
        label: "VmPeak",
        radioGroup: "filter",
        value: "totalVmPeak",
      },
      {
        label: "VmRSS",
        radioGroup: "filter",
        value: "totalVmRSS",
      },
      {
        label: "Threads",
        radioGroup: "filter",
        value: "totalThreads",
      },
      {
        label: "Desc",
        radioGroup: "order",
        value: "desc",
      },
      {
        label: "Asc",
        radioGroup: "order",
        value: "asc",
      },
    ];
  }, []);
  return (
    <div className={viewFilters ? "filter-visible" : "filter-hidden"}>
      <div className="__radio-container">
        {radioArrToMap?.map((n, i) => {
          if (i < 3) {
            return (
              <div key={i} className="radio-filter">
                <h6>{n?.label}</h6>
                <input type="radio" name={n?.radioGroup} value={n?.value} 
                checked = {filtersState[0] === n?.value}
                onChange={(e) => {
                  const prevState = [...filtersState];
                  prevState[0] = e.target.value;
                  setFiltersState(prevState);
                  filters.current = prevState;
                }}
                />
              </div>
            );
          }
        })}
      </div>
      <div className="__radio-container">
      {radioArrToMap?.map((n, i) => {
          if (i >= 3 && i < 7) {
            return (
              <div key={i} className="radio-filter">
                <h6>{n?.label}</h6>
                <input type="radio" name={n?.radioGroup} value={n?.value} 
                checked = {filtersState[0] === n?.value}
                onChange={(e) => {
                  const prevState = [...filtersState];
                  prevState[0] = e.target.value;
                  setFiltersState(prevState);
                  filters.current = prevState;
                }}
                />
              </div>
            );
          }
        })}
      </div>
      <div className="__radio-container">
      {radioArrToMap?.map((n, i) => {
          if (i >= 7) {
            return (
              <div key={i} className="radio-filter">
                <h6>{n?.label}</h6>
                <input type="radio" name={n?.radioGroup} value={n?.value} 
                checked = {filtersState[1] === n?.value}
                onChange={(e) => {
                  const prevState = [...filtersState];
                  prevState[1] = e.target.value;
                  setFiltersState(prevState);
                  filters.current = prevState;
                }}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
