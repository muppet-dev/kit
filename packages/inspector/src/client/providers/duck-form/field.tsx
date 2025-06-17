import { type PropsWithChildren, createContext, useContext } from "react";
import type { DuckField } from "../../components/DuckField";

// biome-ignore lint/suspicious/noExplicitAny: Context is generic
const FieldContext = createContext<DuckField<any> | null>(null);

export type FieldProvider<T extends Record<string, unknown>> =
  PropsWithChildren<DuckField<T>>;

export function FieldProvider<T extends Record<string, unknown>>({
  children,
  ...values
}: FieldProvider<T>) {
  return (
    <FieldContext.Provider value={values}>{children}</FieldContext.Provider>
  );
}

export function useField<T extends Record<string, unknown>>() {
  const context = useContext<DuckField<T> | null>(FieldContext);

  if (!context) throw new Error("Missing FieldContext.Provider in the tree");

  return context;
}
