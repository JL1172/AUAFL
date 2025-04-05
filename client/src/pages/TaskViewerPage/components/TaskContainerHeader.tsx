import { CiPause1 } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { RxResume } from "react-icons/rx";

interface Props {
  setViewFilters: (n: boolean) => void;
  watchStatus: boolean;
  setWatchStatus: (n: boolean) => void;
  viewFilters: boolean;
}
export default function TaskContainerHeader({
  setViewFilters,
  viewFilters,
  setWatchStatus,
  watchStatus,
}: Props) {
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
