import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react";
import { type ConnectionInfo, useConnectionManager } from "./manager";

type ConnectionContextType = ReturnType<typeof useConnectionManager>;

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider = (
  props: PropsWithChildren<ConnectionInfo>,
) => {
  const values = useConnectionManager(props);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    values.connect();
  }, [props]);

  return (
    <ConnectionContext.Provider value={values}>
      {props.children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);

  if (!context)
    throw new Error("Missing ConnectionContext.Provider in the tree!");

  return context;
};
