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
        value: "memory",
      },
      {
        label: "CPU %",
        radioGroup: "filter",
        value: "averageCpuTime",
      },
      {
        label: "VmSwap",
        radioGroup: "filter",
        value: "currSwap",
      },
      {
        label: "VmPeak",
        radioGroup: "filter",
        value: "memPeakAverage",
      },
      {
        label: "VmRSS",
        radioGroup: "filter",
        value: "currRam",
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
          if (i >= 3 && i < 6) {
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
          if (i >= 6) {
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
