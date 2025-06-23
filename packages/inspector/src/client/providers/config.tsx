import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { PostHogProvider } from "posthog-js/react";
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
import { SortingEnum } from "../lib/utils";
import type { configTransportSchema } from "../validations";
import type { ConnectionInfo } from "./connection/manager";
import { usePreferences } from "./preferences";
import type { getRuntimeKey } from "hono/adapter";

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

  const childrenWithProvider = (
    <ConfigContext.Provider value={values}>{children}</ConfigContext.Provider>
  );

  if (values.isTelemetryEnabled) {
    return (
      <PostHogProvider
        apiKey="phc_otNSIzTSlGNf7Ab9yv33q2tYvGu5EGgnLiF9Y0kwnoo"
        options={{
          api_host: "https://us.i.posthog.com",
        }}
      >
        {childrenWithProvider}
      </PostHogProvider>
    );
  }

  return childrenWithProvider;
};

const SupportedRuntimesForTracing: ReturnType<typeof getRuntimeKey>[] = [
  "node",
  "bun",
  "workerd",
];

function useConfigManager(props: ConfigProvider) {
  const [connectionInfo, setConnectionInfo] = useState(props.connection);
  const [connectionLink, setConnectionLink] = useState<{
    url: URL;
    headers: HeadersInit;
  }>();
  const [localSavedConfigs, setConfigurations] = useLocalStorage<
    ConnectionInfo[] | null
  >(CONFIG_STORAGE_KEY);
  const { configurationsSort } = usePreferences();

  const { data: version } = useQuery({
    queryKey: ["version"],
    queryFn: () =>
      fetch(`${proxyAddress}/version`).then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to fetch version data. Please check your network connection or try again later.",
          );
        }

        return res.text() as Promise<string>;
      }),
  });

  const { data: npmVersion } = useQuery({
    queryKey: ["npm", "version"],
    queryFn: () =>
      fetch("https://registry.npmjs.org/@muppet-kit/inspector/latest").then(
        (res) => {
          if (!res.ok) {
            throw new Error(
              "Failed to fetch version data. Please check your network connection or try again later.",
            );
          }

          return res.json() as Promise<Record<string, any>>;
        },
      ),
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
          enableTelemetry: boolean;
          models:
            | {
                default: string;
                available: string[];
              }
            | false;
          configurations:
            | z.infer<typeof configTransportSchema>
            | z.infer<typeof configTransportSchema>[];
          runtime: ReturnType<typeof getRuntimeKey>;
        }>;
      }),
  });

  const proxyAddress = useMemo(() => {
    if (connectionInfo?.proxy && connectionInfo.proxy !== "")
      return connectionInfo.proxy;

    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  }, [connectionInfo]);

  const createLink = useMutation({
    mutationFn: async () => {
      if (!connectionLink) return undefined;

      const { id, url } = await fetch(`${proxyAddress}/api/tunnel`).then(
        (res) => {
          if (!res.ok) {
            throw new Error(
              "Failed to generate a new tunneling URL. Please try again.",
            );
          }

          return res.json() as Promise<{ id: string; url: string }>;
        },
      );

      const publicUrl = new URL(
        connectionLink.url.pathname +
          connectionLink.url.search +
          connectionLink.url.hash,
        url,
      );

      const tunnel = { id, headers: connectionLink.headers, url: publicUrl };

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

  const isTelemetryEnabled = useMemo(() => {
    if (import.meta.env.DEV) return false;
    return !!config?.enableTelemetry;
  }, [config?.enableTelemetry]);

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

  const getDeafultConfigurations = useCallback(() => {
    if (!config?.configurations) return [];

    if (Array.isArray(config.configurations)) {
      return config.configurations;
    }

    return [config.configurations];
  }, [config?.configurations]);

  const deleteConfiguration = (name?: string) => {
    if (name) {
      setConfigurations(
        (prev) => prev?.filter((item) => item.name !== name) ?? [],
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
          tmp.unshift(configuration);
        }
      }

      return tmp;
    });
  };

  const clearAllConfigurations = () => setConfigurations(null);

  const configurations = useMemo(() => {
    const items = [...getDeafultConfigurations(), ...(localSavedConfigs ?? [])];

    if (configurationsSort === SortingEnum.DESCENDING) {
      items.reverse();
    }

    return items;
  }, [localSavedConfigs, configurationsSort, getDeafultConfigurations]);

  const isTracingEnabled = useMemo(() => {
    if (!config?.runtime) return false;
    return SupportedRuntimesForTracing.includes(config.runtime);
  }, [config?.runtime]);

  return {
    config,
    version,
    npmVersion,
    connectionLink,
    setConnectionLink,
    isTunnelingEnabled,
    isTelemetryEnabled,
    createLink,
    isModelsEnabled,
    getAvailableModels,
    getDefaultModel,
    connectionInfo,
    setConnectionInfo: (info: ConnectionInfo) => {
      setConnectionInfo(info);
    },
    proxyAddress,
    configurations,
    localSavedConfigs,
    addConfigurations,
    deleteConfiguration,
    clearAllConfigurations,
    isTracingEnabled,
  };
}

export const useConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("Missing ConfigContext.Provider in the tree!");

  return context;
};
