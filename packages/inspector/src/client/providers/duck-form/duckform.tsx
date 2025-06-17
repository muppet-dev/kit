import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useContext,
} from "react";
import { DuckFieldComponentNotFound } from "../../components/DuckFieldNotFound";

type DuckFormContextType<T> = {
  readonly components: Record<string, () => ReactNode>;
  readonly generateId?: (
    schema: Record<string, T>,
    props: Record<string, unknown>,
  ) => string | undefined;
  readonly resolver: (
    schema: Record<string, T>,
    props: Record<string, unknown>,
  ) => T | undefined;
};

// biome-ignore lint/suspicious/noExplicitAny: Generic context
const DuckFormContext = createContext<DuckFormContextType<any> | null>(null);

export type DuckForm<T> = PropsWithChildren<Partial<DuckFormContextType<T>>>;

export function DuckForm<T>({
  children,
  components = {},
  resolver = defaultResolver,
  generateId,
}: DuckForm<T>) {
  const value = {
    components: { default: DuckFieldComponentNotFound, ...components },
    resolver,
    generateId,
  };

  return (
    <DuckFormContext.Provider value={value}>
      {children}
    </DuckFormContext.Provider>
  );
}

export function useDuckForm<T>() {
  const context = useContext<DuckFormContextType<T> | null>(DuckFormContext);

  if (!context) throw new Error("Missing DuckFormContext.Provider in the tree");

  return context;
}

function defaultResolver<T>(
  schema: Record<string, T>,
  props: Record<string, unknown>,
): T {
  return {
    ...schema[String(props.id)],
    ...props,
  };
}
