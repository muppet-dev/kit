import {
  type ConnectionInfo,
  getMCPProxyAddress,
} from "@/client/providers/connection/manager";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { z } from "zod";
import type { transportSchema } from "../validations";
import toast from "react-hot-toast";

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
          models:
            | {
                default: string;
                available: string[];
              }
            | false;
          configurations:
            | z.infer<typeof transportSchema>
            | z.infer<typeof transportSchema>[];
        }>;
      }),
  });

  const createLink = useMutation({
    mutationFn: async (linkType: "local" | "public") => {
      let url: { url: string; id: string };
      if (linkType === "local") {
        url = { id: "local", url: getMCPProxyAddress() };
      } else {
        url = await fetch(`${getMCPProxyAddress()}/tunnel`).then((res) => {
          if (!res.ok) {
            throw new Error(
              "Failed to generate a new tunneling URL. Please try again.",
            );
          }

          return res.json() as Promise<{ id: string; url: string }>;
        });
      }

      return url;
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const isTunnelingEnabled = useMemo(() => {
    return !!config?.tunneling;
  }, [config?.tunneling]);

  const getAvailableModels = useCallback(() => {
    return config?.models ? config.models.available : [];
  }, [config?.models]);

  const getDefaultModel = useCallback(() => {
    if (!config?.models) return undefined;

    return config.models.default;
  }, [config?.models]);

  const isModelsEnabled = useMemo(() => {
    const models = getAvailableModels();
    return models.length > 0;
  }, [getAvailableModels]);

  function getConfigurations() {
    if (!config?.configurations) return undefined;

    if (Array.isArray(config.configurations)) {
      // TODO: Add support for multiple configurations
      return config.configurations[0];
    }

    return config.configurations;
  }

  return {
    getConfigurations,
    isTunnelingEnabled,
    createLink,
    isModelsEnabled,
    getAvailableModels,
    getDefaultModel,
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
