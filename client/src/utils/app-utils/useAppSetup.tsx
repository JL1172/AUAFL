
import { useCallback, useMemo, useState } from "react";
import { AUAFLAxiosInstance } from "../axios-utils/axios-instance";
import { axiosOptions } from "../axios-utils/axios.options";

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
    if (axiosInstance && axiosOptions) {
      try {
        const res = await axiosInstance[axiosOptions?.general_info?.method](
          `/${axiosOptions?.general_info?.route}`
        );
        console.log(res);
        setAppName(res?.data?.appName);
      } catch {
        alert("Error fetching app data");
      }
    }
  }, [axiosInstance]);

  return {appName, fetchAppData}
};
