import type { ConnectionInfo } from "@/hooks/use-connection";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

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
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>();

  return {
    connectionInfo,
    setConnectionInfo,
  };
}

export const useConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("Missing ConfigContext.Provider in the tree!");

  return context;
};
