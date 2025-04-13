import { FaTemperatureLow } from "react-icons/fa";
import { Sensors, useSensors } from "../../../contexts/SensorContext";
import SensorMovingBar from "./SensorMovingBar";

export default function SensorGuages() {
  const { sensorInfo, maxTempState} = useSensors()!;
  return (
    sensorInfo &&
    sensorInfo?.length > 0 &&
    sensorInfo?.map((n: Sensors, i: number) => {
      return (
        <div
          key={i}
          className={`sensor-box ${
            n?.[maxTempState?.[1] as "c" | "f"] >= maxTempState[0]
              ? "warning"
              : ""
          }`}
        >
          <h1>
            {n?.type} <FaTemperatureLow />
          </h1>
          <div className="temps">
            {["c", "f"].map((metric, idx) => {
              return (
                <SensorMovingBar key={idx} metric={metric as "c" | "f"} n={n} />
              );
            })}
          </div>
        </div>
      );
    })
  );
}
