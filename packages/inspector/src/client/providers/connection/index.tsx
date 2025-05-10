import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useConnectionManager } from "./manager";
import { useConfig } from "../config";
import { useNotification } from "../notifications";

type ConnectionContextType = ReturnType<typeof useConnectionManager>;

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider = ({ children }: PropsWithChildren) => {
  const { connectionInfo } = useConfig();
  const { addNotification, addStdErrNotification } = useNotification();
  const values = useConnectionManager({
    ...connectionInfo!,
    onNotification: addNotification,
    onStdErrNotification: addStdErrNotification,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    async function handler() {
      if (values.mcpClient) {
        await values.disconnect();
      }

      await values.connect();
    }

    handler();
  }, [connectionInfo]);

  return (
    <ConnectionContext.Provider value={values}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);

  if (!context)
    throw new Error("Missing ConnectionContext.Provider in the tree!");

  return context;
};
