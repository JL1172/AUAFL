import { useCallback, useMemo, useRef, useState } from "react";
import { AUAFLAxiosInstance } from "../../../utils/axios-utils/axios-instance";

export type Sensors = {
  type: string;
  raw_temp: number;
  c: number;
  f: number;

};
export type UseSensorsHookReturnType = {
  sensorInfo: Sensors[] | null;
  intervalRef: React.RefObject<number>;
  pollingIntervalRef: React.RefObject<HTMLInputElement | null>;
  fetchSensorInfo: () => Promise<void>;
  intervalState: number;
  setIntervalState: (n: number) => void;
  maxTempThreshold: React.RefObject<HTMLInputElement | null>;
  maxTempState: [number, string];
  setMaxTempState: (n: [number, string]) => void;
  computeHeight: (n: {f: number, c: number}, val: string)=> string;
};
export const useSensors = (): UseSensorsHookReturnType => {
  const axiosInsance = useMemo(() => {
    return AUAFLAxiosInstance.getInstance();
  }, []);
  const [sensorInfo, setSensorInfo] = useState<Sensors[] | null>(null);
  const sensorRef = useRef<Sensors[] | null>(null);
  const intervalRef = useRef(0);
  const [intervalState, setIntervalState] = useState(1000);
  const pollingIntervalRef = useRef<HTMLInputElement | null>(null);
  const maxTempThreshold = useRef<HTMLInputElement | null>(null);
  const [maxTempState, setMaxTempState] = useState<[number, string]>([
    175,
    "f",
  ]);
  const computeHeight = (n: {f: number, c: number}, val: string):string => {
    return val === "f"
      ? `${
          maxTempState[1] === "f"
            ? (n?.f / maxTempState[0]) * 100
            : (n?.f / (maxTempState[0] * (9 / 5) + 32)) * 100
        }%`
      : `${
          maxTempState[1] === "c"
            ? (n?.c / maxTempState[0]) * 100
            : (n?.c / ((maxTempState[0] - 32) * (5 / 9))) * 100
        }%`;
  };
  const fetchSensorInfo = useCallback(async () => {
    try {
      if (axiosInsance) {
        const res: { data: { data: Sensors[] } } = await axiosInsance.get(
          "/sensors"
        );
        sensorRef.current = res.data.data;
        setSensorInfo(res.data.data);
      }
    } catch (err) {
      alert(err);
    }
  }, [axiosInsance]);
  return {
    sensorInfo,
    intervalRef,
    pollingIntervalRef,
    fetchSensorInfo,
    setIntervalState,
    intervalState,
    maxTempState,
    setMaxTempState,
    computeHeight,
    maxTempThreshold,
  };
};
