import {
  getMCPProxyAddress,
  type ConnectionInfo,
} from "@/client/providers/connection/manager";
import { useQuery } from "@tanstack/react-query";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import type { z } from "zod";
import type { transportSchema } from "../validations";

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

  const { data: config } = useQuery({
    queryKey: ["base-config"],
    queryFn: () =>
      fetch(`${getMCPProxyAddress()}/config`).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch config data. Please try again.");
        }

        return res.json() as Promise<{
          tunneling: boolean;
          models: string[] | false;
          configurations: z.infer<typeof transportSchema>;
        }>;
      }),
  });

  return {
    config,
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
