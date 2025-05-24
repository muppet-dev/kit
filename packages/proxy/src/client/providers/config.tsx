import { useQuery } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useContext } from "react";

export const CONFIG_STORAGE_KEY = "muppet-config";

type ConfigContextType = ReturnType<typeof useConfigManager>;

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider = ({ children }: PropsWithChildren) => {
  const values = useConfigManager();

  return (
    <ConfigContext.Provider value={values}>{children}</ConfigContext.Provider>
  );
};

function useConfigManager() {
  const { data: version } = useQuery({
    queryKey: ["version"],
    queryFn: () =>
      fetch("/version").then((res) => {
        if (!res.ok) {
          throw new Error(
            "Failed to fetch version data. Please check your network connection or try again later."
          );
        }

        return res.text() as Promise<string>;
      }),
  });

  return {
    version,
  };
}

export const useConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error("Missing ConfigContext.Provider in the tree!");

  return context;
};
