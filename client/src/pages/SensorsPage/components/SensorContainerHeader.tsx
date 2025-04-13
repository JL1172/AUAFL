import { useSensors } from "../../../contexts/SensorContext";

export default function SensorContainerHeader() {
  const {
    pollingIntervalRef,
    intervalState,
    setIntervalState,
    maxTempState,
    setMaxTempState,
    maxTempThreshold,
  } = useSensors()!;
  return (
    <>
      <div className="first-top">
        <h5>Sensor Temperature Info</h5>
        <span>
          <h6>Polling Interval (ms):</h6>
          <input
            ref={pollingIntervalRef}
            type="number"
            value={intervalState}
            onChange={(e) => setIntervalState(+e.target.value)}
          />
        </span>
      </div>
      <div
        className="second-top"
        title="Once a sensor hits this temperature, a warning will appear"
      >
        <h6>Max Temperature Threshold:</h6>
        <input
          value={maxTempState[0]}
          onChange={(e) => {
            setMaxTempState([+e.target.value, maxTempState[1]]);
          }}
          ref={maxTempThreshold}
          type="number"
        />
        <div className="_radio-container">
          <label htmlFor="system">
            <p>Celcius</p>
            <input
              type="radio"
              name="system"
              value="c"
              onChange={(e) =>
                setMaxTempState([maxTempState[0], e.target.value])
              }
              checked={maxTempState[1] === "c"}
            />
          </label>
          <label htmlFor="system">
            <p>Fahrenheit</p>
            <input
              value="f"
              onChange={(e) =>
                setMaxTempState([maxTempState[0], e.target.value])
              }
              type="radio"
              name="system"
              checked={maxTempState[1] === "f"}
            />
          </label>
        </div>
      </div>
    </>
  );
}
