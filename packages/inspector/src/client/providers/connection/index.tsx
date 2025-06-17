import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";
import { useConfig } from "../config";
import { useNotification } from "../notifications";
import { useRoots } from "../roots";
import { useSampling } from "../sampling";
import { useConnectionManager } from "./manager";

type ConnectionContextType = ReturnType<typeof useConnectionManager>;

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider = ({ children }: PropsWithChildren) => {
  const { connectionInfo, proxyAddress } = useConfig();
  const { addNotification, addStdErrNotification } = useNotification();

  const roots = useRoots();
  const { setPendingSampleRequests, nextRequestId } = useSampling();

  const values = useConnectionManager({
    ...connectionInfo!,
    onNotification: addNotification,
    onStdErrNotification: addStdErrNotification,
    proxy: proxyAddress,
    getRoots: () => roots.current ?? [],
    onPendingRequest: (request, resolve, reject) => {
      setPendingSampleRequests((prev) => [
        ...prev,
        { id: nextRequestId.current++, request, resolve, reject },
      ]);
    },
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
