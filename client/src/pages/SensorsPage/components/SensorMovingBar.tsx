import { Sensors, useSensors } from "../../../contexts/SensorContext";

export default function SensorMovingBar({
  metric,
  n,
}: {
  metric: "c" | "f";
  n: Sensors;
}) {
  const { computeHeight } = useSensors()!;
  const { percentage, alphaChannelValue, tooltip } = computeHeight(n, metric);
  return (
    <div
      className="temp"
      title={`Threshold is ${tooltip}`}
    >
      <div className="moving-bar">
        <div
          className="bar"
          style={{
            height: `${percentage}%`,
          }}
        ></div>
        <div
          style={{
            height: `${percentage}%`,
            backgroundColor: `rgba(189, 91, 91, ${alphaChannelValue})`,
          }}
          className="warning-overlay"
        ></div>
      </div>
      <p>
        {n?.[metric]} {metric}
      </p>
    </div>
  );
}
