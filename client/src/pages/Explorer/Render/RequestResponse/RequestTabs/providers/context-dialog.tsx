import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import type { ContextDialog } from "../types";

type ContextDialogContextType = ReturnType<typeof useContextDialogManager>;

const ContextDialogContext = createContext<ContextDialogContextType | null>(
  null
);

export const ContextDialogProvider = (props: PropsWithChildren) => {
  const values = useContextDialogManager();

  return (
    <ContextDialogContext.Provider value={values}>
      {props.children}
    </ContextDialogContext.Provider>
  );
};

function useContextDialogManager() {
  const [open, setOpen] = useState<ContextDialog | null>(null);

  return { open, setOpen };
}

export const useContextDialog = () => {
  const context = useContext(ContextDialogContext);

  if (!context)
    throw new Error("Missing ContextDialogContext.Provider in the tree!");

  return context;
};
