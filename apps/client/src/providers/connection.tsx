import { useConnection as useConnectionManager, ConnectionInfo } from "@/hooks/use-connection";
import {
  type PropsWithChildren,
  createContext,
  useContext,
} from "react";

type ConnectionContextType = ReturnType<typeof useConnectionManager>;

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider = (props: PropsWithChildren<ConnectionInfo>) => {
  const values = useConnectionManager({
    ...props
  });
    

  return (
    <ConnectionContext.Provider value={values}>{props.children}</ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);

  if (!context) throw new Error("Missing ConnectionContext.Provider in the tree!");

  return context;
};
