import type { ConnectionInfo } from "@/hooks/use-connection";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

const STORAGE_KEY = "muppet-config";

type ConfigContextType = ReturnType<typeof useConfigManager>;

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider = (props: PropsWithChildren) => {
  const values = useConfigManager();

  return (
    <ConfigContext.Provider value={values}>
      {props.children}
    </ConfigContext.Provider>
  );
};

function useConfigManager() {
  const [connectionInfo, setConnectionInfo] = useState<
    ConnectionInfo | undefined
  >(() => {
    const localStorageValue = localStorage.getItem(STORAGE_KEY);
    if (!localStorageValue) return undefined;
    return JSON.parse(localStorageValue) as ConnectionInfo;
  });

  return {
    connectionInfo,
    setConnectionInfo: (info: ConnectionInfo) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
      setConnectionInfo(info);
    },
  };
}

export const useConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("Missing ConfigContext.Provider in the tree!");

  return context;
};
