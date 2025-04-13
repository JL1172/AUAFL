import { CiPause1 } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { RxResume } from "react-icons/rx";
import { useTask } from "../../../contexts/TaskViewerContext";

export default function TaskContainerHeader() {
  const {
    setViewFilters,
    viewFilters,
    setWatchStatus,
    watchStatus,
    setIntervalState,
    pollingIntervalRef,
    intervalState,
  } = useTask()!;
  return (
    <div className="first-top">
      <span
        onClick={() => {
          setViewFilters(!viewFilters);
        }}
        className="filter--icon"
      >
        <IoFilter />
      </span>
      <h5>System Processes </h5>
      <span>
        <h6>Polling Interval (ms):</h6>
        <input
          ref={pollingIntervalRef}
          type="number"
          value={intervalState}
          onChange={(e) => setIntervalState(+e.target.value)}
        />
      </span>
      <span onClick={() => setWatchStatus(!watchStatus)} className="pause">
        <h6>{watchStatus ? "Pause Watch" : "Resume Watch"}</h6>
        {watchStatus ? (
          <CiPause1 style={{ width: "1.5rem" }} />
        ) : (
          <RxResume style={{ width: "1.5rem" }} />
        )}
      </span>
    </div>
  );
}
