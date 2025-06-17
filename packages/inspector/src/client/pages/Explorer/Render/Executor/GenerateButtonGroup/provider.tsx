import { useMutation } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useContext } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useConfig } from "../../../../../providers";
import { Tool } from "../../../providers";
import type { MCPItemType } from "../../../types";

type GenerateContextType = ReturnType<typeof useGenerateManager>;

const GenerateContext = createContext<GenerateContextType | null>(null);

export const GenerateProvider = (props: PropsWithChildren) => {
  const values = useGenerateManager();

  return (
    <GenerateContext.Provider value={values}>
      {props.children}
    </GenerateContext.Provider>
  );
};

function useGenerateManager() {
  const { reset } = useFormContext();
  const { proxyAddress } = useConfig();

  return useMutation({
    mutationFn: async (
      values: MCPItemType & { context?: string; modelId?: string },
    ) => {
      const schema =
        values.type === Tool.TOOLS || values.type === Tool.PROMPTS
          ? values.schema
          : undefined;

      let hasSchema = false;

      if (schema) {
        if (
          (typeof schema === "object" &&
            !Array.isArray(schema) &&
            Object.keys(schema).length > 0) ||
          (Array.isArray(schema) && schema.length > 0)
        ) {
          hasSchema = true;
        }
      }

      if (!hasSchema) {
        throw new Error("No schema found for this tool.");
      }

      return fetch(`${proxyAddress}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to generate data. Please try again later.");
        }

        return res.json();
      });
    },
    onSuccess: (data) => {
      reset(data);
      toast.success("Data generated successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });
}

export const useGenerate = () => {
  const context = useContext(GenerateContext);

  if (!context)
    throw new Error("Missing GenerateContext.Provider in the tree!");

  return context;
};
