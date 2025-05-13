import { EmptyResultSchema } from "@modelcontextprotocol/sdk/types.js";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConnection } from "./connection";

type PingServerContextType = ReturnType<typeof usePingServerManager>;

const PingServerContext = createContext<PingServerContextType | null>(null);

export const PingServerProvider = (props: PropsWithChildren) => {
  const values = usePingServerManager();

  return (
    <PingServerContext.Provider value={values}>
      {props.children}
    </PingServerContext.Provider>
  );
};

function usePingServerManager() {
  const { makeRequest } = useConnection();
  const [timeInterval, setTimeInterval] = useState<number | undefined>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!timeInterval) return;

    const id = setInterval(async () => {
      await makeRequest(
        {
          method: "ping",
        },
        EmptyResultSchema,
      );
    }, timeInterval * 1000);

    return () => clearInterval(id);
  }, [timeInterval]);

  const clearTimeInterval = () => setTimeInterval(undefined);

  return { timeInterval, setTimeInterval, clearTimeInterval };
}

export const usePingServer = () => {
  const context = useContext(PingServerContext);

  if (!context)
    throw new Error("Missing PingServerContext.Provider in the tree!");

  return context;
};
