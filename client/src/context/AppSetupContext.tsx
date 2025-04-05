import React, { createContext, useContext, useEffect } from "react";
import {
  useAppSetup,
} from "../utils/app-utils/useAppSetup";

interface AppContext {
  appName: string;
}

const AppSetupContext = createContext<AppContext | undefined>(undefined);

export const AppSetupProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { appName, fetchAppData } = useAppSetup();
  useEffect(() => {
    fetchAppData();
  }, [fetchAppData]);
  return (
    <AppSetupContext.Provider
      value={{
        appName,
      }}
    >
      {children}
    </AppSetupContext.Provider>
  );
};

export const useApp = () => useContext(AppSetupContext);
