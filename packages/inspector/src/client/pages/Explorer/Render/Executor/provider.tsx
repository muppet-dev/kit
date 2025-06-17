import type {
  CallToolResultSchema,
  GetPromptResultSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { useMutation } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useContext } from "react";
import type { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import { useMCPItem } from "../../providers";

type CustomFormContextType = ReturnType<typeof useCustomFormManager>;

const CustomFormContext = createContext<CustomFormContextType | null>(null);

export const CustomFormProvider = (props: PropsWithChildren) => {
  const values = useCustomFormManager();

  return (
    <CustomFormContext.Provider value={values}>
      {props.children}
    </CustomFormContext.Provider>
  );
};

function useCustomFormManager() {
  const { selectedItem, callItem } = useMCPItem();

  return useMutation({
    mutationFn: async (values: FieldValues) => {
      const startTime = performance.now();

      values.__reset = undefined;

      const result = await callItem(selectedItem!, values);
      return {
        duration: performance.now() - startTime,
        content: result as
          | z.infer<typeof CallToolResultSchema>
          | z.infer<typeof GetPromptResultSchema>
          | z.infer<typeof ReadResourceResultSchema>,
      };
    },
    onSuccess: () => {
      toast.success("Request sent successfully!");
    },
    onError: (error) => {
      console.error("Request failed:", error);

      toast.error(error.message);
    },
  });
}

export const useCustomForm = () => {
  const context = useContext(CustomFormContext);

  if (!context)
    throw new Error("Missing CustomFormContext.Provider in the tree!");

  return context;
};
