import type { Root } from "@modelcontextprotocol/sdk/types.js";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";

type RootsContextType = ReturnType<typeof useRootsManager>;

const RootsContext = createContext<RootsContextType | null>(null);

export const RootsProvider = ({ children }: PropsWithChildren) => {
  const values = useRootsManager();

  return (
    <RootsContext.Provider value={values}>{children}</RootsContext.Provider>
  );
};

function useRootsManager() {
  const ref = useRef<Root[]>(null);

  return ref;
}

export const useRoots = () => {
  const context = useContext(RootsContext);

  if (!context) throw new Error("Missing RootsContext.Provider in the tree!");

  return context;
};
