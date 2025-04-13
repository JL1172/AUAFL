import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { AUAFLAxiosInstance } from "../utils/axios-utils/axios-instance";

export type Sensors = {
  type: string;
  raw_temp: number;
  c: number;
  f: number;
};
export type SensorContext = {
  sensorInfo: Sensors[] | null;
  intervalRef: React.RefObject<number>;
  pollingIntervalRef: React.RefObject<HTMLInputElement | null>;
  fetchSensorInfo: () => Promise<void>;
  intervalState: number;
  setIntervalState: (n: number) => void;
  maxTempThreshold: React.RefObject<HTMLInputElement | null>;
  maxTempState: [number, string];
  setMaxTempState: (n: [number, string]) => void;
  computeHeight: (
    n: { f: number; c: number },
    val: string
  ) => { percentage: number; alphaChannelValue: number, tooltip: string };
  conversions: { celcius: number; fahrenheit: number };
};
// eslint-disable-next-line
export const SensorContext = createContext<SensorContext | null>(null);

export const SensorProvider = ({ children }: { children: React.ReactNode }) => {
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
  const conversions = useMemo(() => {
    switch (maxTempState[1]) {
      case "f": {
        return {
          celcius: Math.floor((maxTempState[0] - 32) * (5 / 9)),
          fahrenheit: maxTempState[0],
        };
      }
      default: {
        return {
          celcius: maxTempState[0],
          fahrenheit: Math.floor(maxTempState[0] * (9 / 5) + 32),
        };
      }
    }
  }, [maxTempState]);
  const computeHeight = useCallback(
    (
      n: { f: number; c: number },
      val: string
    ): { percentage: number; alphaChannelValue: number; tooltip: string } => {
      const metric = maxTempState[1];
      const maxTemp = maxTempState[0];
      const c_tool = `${conversions?.celcius} C`;
      const f_tool = `${conversions?.fahrenheit} F`;
      switch (val) {
        case "f": {
          if (metric === "f") {
            const base = n?.f / maxTemp;
            return {
              percentage: base * 100,
              alphaChannelValue: Math.pow(base, 2),
              tooltip: f_tool,
            };
          }
          const base = n?.f / (maxTemp * (9 / 5) + 32);
          return {
            percentage: base * 100,
            alphaChannelValue: Math.pow(base, 2),
            tooltip: f_tool,
          };
        }
        default: {
          if (metric === "c") {
            const base = n?.c / maxTemp;
            return {
              percentage: base * 100,
              alphaChannelValue: Math.pow(base, 2),
              tooltip: c_tool,
            };
          }
          const base = n?.c / ((maxTemp - 32) * (5 / 9));
          return {
            percentage: base * 100,
            alphaChannelValue: Math.pow(base, 2),
            tooltip: c_tool,
          };
        }
      }
    },
    [maxTempState, conversions]
  );
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
  return (
    <SensorContext.Provider
      value={{
        sensorInfo,
        intervalRef,
        conversions,
        intervalState,
        pollingIntervalRef,
        computeHeight,
        fetchSensorInfo,
        maxTempState,
        maxTempThreshold,
        setIntervalState,
        setMaxTempState,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};
// eslint-disable-next-line
export const useSensors = () => useContext(SensorContext);
