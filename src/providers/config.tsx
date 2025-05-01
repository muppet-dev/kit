import type { ConnectionInfo } from "@/providers/connection/manager";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export const CONFIG_STORAGE_KEY = "muppet-config";

type ConfigContextType = ReturnType<typeof useConfigManager>;

const ConfigContext = createContext<ConfigContextType | null>(null);

export type ConfigProvider = {
  connection?: ConnectionInfo;
};

export const ConfigProvider = ({
  children,
  ...props
}: PropsWithChildren<ConfigProvider>) => {
  const values = useConfigManager(props);

  return (
    <ConfigContext.Provider value={values}>{children}</ConfigContext.Provider>
  );
};

function useConfigManager(props: ConfigProvider) {
  const [connectionInfo, setConnectionInfo] = useState(props.connection);

  return {
    connectionInfo,
    setConnectionInfo: (info: ConnectionInfo) => {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(info));
      setConnectionInfo(info);
    },
  };
}

export const useConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("Missing ConfigContext.Provider in the tree!");

  return context;
};
