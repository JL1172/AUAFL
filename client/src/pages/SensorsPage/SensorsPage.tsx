import { useEffect } from "react";
import "./sensors-page.scss";
import SensorContainerHeader from "./components/SensorContainerHeader";
import { useSensors } from "../../contexts/SensorContext";
import SensorGuages from "./components/SensorGauges";
export default function SensorsPage() {
  const { fetchSensorInfo, intervalRef, pollingIntervalRef } = useSensors()!;
  useEffect(() => {
    if (pollingIntervalRef?.current?.value) {
      intervalRef.current = +setInterval(() => {
        fetchSensorInfo();
      }, Number(pollingIntervalRef?.current?.value) || 1000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="sensors-page">
      <div className="sensor-container">
        <div className="top-row--">
          <SensorContainerHeader />
        </div>
        <div className="sensor-list">
          <SensorGuages />
        </div>
      </div>
    </div>
  );
}
