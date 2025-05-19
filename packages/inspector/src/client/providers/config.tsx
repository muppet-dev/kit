import type { ConnectionInfo } from "./connection/manager";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import type z from "zod";
import type { configTransportSchema } from "../validations";

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
  const [connectionLink, setConnectionLink] = useState<{
    url: URL;
    headers: HeadersInit;
  }>();
  const [localSavedConfigs, setConfigurations] = useLocalStorage<
    ConnectionInfo[] | null
  >(CONFIG_STORAGE_KEY);

  const { data: version } = useQuery({
    queryKey: ["version"],
    queryFn: () =>
      fetch(`${proxyAddress}/version`).then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to fetch version data. Please check your network connection or try again later."
          );
        }

        return res.text() as Promise<string>;
      }),
  });

  const { data: config } = useQuery({
    queryKey: ["base-config"],
    queryFn: () =>
      fetch(`${proxyAddress}/api/config`).then((res) => {
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
            | z.infer<typeof configTransportSchema>
            | z.infer<typeof configTransportSchema>[];
        }>;
      }),
  });

  const proxyAddress = useMemo(() => {
    if (connectionInfo?.proxy && connectionInfo.proxy !== "")
      return connectionInfo.proxy;

    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  }, [connectionInfo]);

  const createLink = useMutation({
    mutationFn: async (linkType: "local" | "public") => {
      let tunnel: { id: string; url: URL; headers: HeadersInit };

      if (!connectionLink) return undefined;

      if (linkType === "local") {
        tunnel = { id: "local", ...connectionLink };
      } else {
        const { id, url } = await fetch(`${proxyAddress}/api/tunnel`).then(
          (res) => {
            if (!res.ok) {
              throw new Error(
                "Failed to generate a new tunneling URL. Please try again."
              );
            }

            return res.json() as Promise<{ id: string; url: string }>;
          }
        );

        const publicUrl = new URL(
          connectionLink.url.pathname +
            connectionLink.url.search +
            connectionLink.url.hash,
          url
        );

        tunnel = { id, headers: connectionLink.headers, url: publicUrl };
      }

      return tunnel;
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

  function getDeafultConfigurations() {
    if (!config?.configurations) return [];

    if (Array.isArray(config.configurations)) {
      return config.configurations;
    }

    return [config.configurations];
  }

  const deleteConfiguration = (name?: string) => {
    if (name) {
      setConfigurations(
        (prev) => prev?.filter((item) => item.name !== name) ?? []
      );
    }
  };

  const addConfigurations = (values: ConnectionInfo | ConnectionInfo[]) => {
    setConfigurations((prev) => {
      const tmp = prev ? [...prev] : [];
      const configurations = Array.isArray(values) ? values : [values];

      for (const configuration of configurations) {
        const index = tmp.findIndex((item) => item.name === configuration.name);
        if (index !== -1) {
          tmp[index] = configuration;
        } else {
          tmp.push(configuration);
        }
      }

      return tmp;
    });
  };

  const clearAllConfigurations = () => setConfigurations(null);

  return {
    version,
    connectionLink,
    setConnectionLink,
    isTunnelingEnabled,
    createLink,
    isModelsEnabled,
    getAvailableModels,
    getDefaultModel,
    connectionInfo,
    setConnectionInfo: (info: ConnectionInfo) => {
      setConnectionInfo(info);
    },
    proxyAddress,
    configurations: [
      ...getDeafultConfigurations(),
      ...(localSavedConfigs ?? []),
    ],
    localSavedConfigs,
    addConfigurations,
    deleteConfiguration,
    clearAllConfigurations,
  };
}

export const useConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("Missing ConfigContext.Provider in the tree!");

  return context;
};
