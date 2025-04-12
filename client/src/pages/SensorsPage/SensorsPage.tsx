import { useEffect } from "react";
import { Sensors, useSensors } from "./hooks/useSensors";
import "./sensors-page.scss";
import SensorContainerHeader from "./components/SensorContainerHeader";
import { FaTemperatureLow } from "react-icons/fa";
export default function SensorsPage() {
  const {
    fetchSensorInfo,
    intervalRef,
    pollingIntervalRef,
    sensorInfo,
    intervalState,
    setIntervalState,
    maxTempState,
    maxTempThreshold,
    setMaxTempState,
    computeHeight,
  } = useSensors();
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
          <SensorContainerHeader
            pollingIntervalRef={pollingIntervalRef}
            intervalState={intervalState}
            setIntervalState={setIntervalState}
            maxTempState={maxTempState}
            maxTempThreshold={maxTempThreshold}
            setMaxTempState={setMaxTempState}
          />
        </div>
        <div className="sensor-list">
          {sensorInfo &&
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
                    <div className="temp">
                      <div className="moving-bar">
                        <div
                          className="bar"
                          style={{
                            height: computeHeight(n, "f"),
                          }}
                        ></div>
                        <div
                          style={{
                            height: computeHeight(n, "f"),
                            backgroundColor: `rgba(189, 91, 91, ${
                                Math.pow((((+computeHeight(n, "f")?.replace("%",""))) / 100),2)
                              })`,
                          }}
                          className="warning-overlay"
                        ></div>
                      </div>
                      <p>{n?.f} F</p>
                    </div>
                    <div className="temp">
                      <div className="moving-bar">
                        <div
                          className="bar"
                          style={{
                            height: computeHeight(n, "c"),
                          }}
                        ></div>
                        <div
                          className="warning-overlay"
                          style={{
                            height: computeHeight(n, "c"),
                            backgroundColor: `rgba(189, 91, 91, ${
                                Math.pow((((+computeHeight(n, "c")?.replace("%",""))) / 100),2)
                              })`,
                          }}
                        ></div>
                      </div>
                      <p>{n?.c} C</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
