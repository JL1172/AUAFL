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
  return (
    <div className={viewFilters ? "filter-visible" : "filter-hidden"}>
      <div className="__radio-container">
        <div className="radio-filter">
          <h6>Name</h6>
          <input
            type="radio"
            name="filter"
            value="Name"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[0] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[0] === "Name"}
          />
        </div>
        <div className="radio-filter">
          <h6>Memory %</h6>
          <input
            type="radio"
            name="filter"
            value="memory"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[0] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[0] === "memory"}
          />
        </div>

        <div className="radio-filter">
          <h6>CPU %</h6>
          <input
            type="radio"
            name="filter"
            value="averageCpuTime"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[0] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[0] === "averageCpuTime"}
          />
        </div>
      </div>
      <div className="__radio-container">
        <div className="radio-filter">
          <h6>VmSwap</h6>
          <input
            type="radio"
            name="filter"
            value="currSwap"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[0] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[0] === "currSwap"}
          />
        </div>
        <div className="radio-filter">
          <h6>VmPeak</h6>
          <input
            type="radio"
            name="filter"
            value="memPeakAverage"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[0] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[0] === "memPeakAverage"}
          />
        </div>
        <div className="radio-filter">
          <h6>VmRSS</h6>
          <input
            type="radio"
            name="filter"
            value="currRam"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[0] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[0] === "currRam"}
          />
        </div>
      </div>
      <div className="__radio-container">
        <div className="radio-filter">
          <h6>Desc</h6>
          <input
            type="radio"
            name="order"
            value="desc"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[1] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[1] === "desc"}
          />
        </div>
        <div className="radio-filter">
          <h6>Asc</h6>
          <input
            type="radio"
            name="order"
            value="asc"
            onChange={(e) => {
              const prevState = [...filtersState];
              prevState[1] = e.target.value;
              setFiltersState(prevState);
              filters.current = prevState;
            }}
            checked={filtersState[1] === "asc"}
          />
        </div>
      </div>
    </div>
  );
}
