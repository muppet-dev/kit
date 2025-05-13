import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useContext,
} from "react";

type BlueprintContextType<T> = {
  readonly schema: Record<string, T>;
  readonly wrapper?: (props: PropsWithChildren) => ReactNode;
};

// biome-ignore lint/suspicious/noExplicitAny: Context is generic
const BlueprintContext = createContext<BlueprintContextType<any> | null>(null);

export type Blueprint<T> = PropsWithChildren<Partial<BlueprintContextType<T>>>;

export function Blueprint<T>({ children, schema = {}, wrapper }: Blueprint<T>) {
  return (
    <BlueprintContext.Provider value={{ schema, wrapper }}>
      {children}
    </BlueprintContext.Provider>
  );
}

export function useBlueprint<T extends Record<string, unknown>>() {
  const context = useContext<BlueprintContextType<T> | null>(BlueprintContext);

  if (!context)
    throw new Error("Missing BlueprintContext.Provider in the tree");

  return context;
}
