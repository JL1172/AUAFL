
import { useCallback, useMemo, useState } from "react";
import { AUAFLAxiosInstance } from "../axios-utils/axios-instance";

export type useAppSetupReturnType ={
    appName: string;
    fetchAppData: () => Promise<void>
}

export const useAppSetup = (): useAppSetupReturnType => {
  const [appName, setAppName] = useState("");

  const axiosInstance = useMemo(() => {
    return AUAFLAxiosInstance.getInstance();
  }, []);

  const fetchAppData = useCallback(async () => {
    if (axiosInstance) {
      try {
        const res = await axiosInstance.get(
          `/general-info`
        );
        setAppName(res?.data?.appName);
      } catch (err){
        console.log(err);
        alert("Error fetching app data");
      }
    }
  }, [axiosInstance]);

  return {appName, fetchAppData}
};
