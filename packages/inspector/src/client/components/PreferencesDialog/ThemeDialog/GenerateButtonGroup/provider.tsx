import { useMutation } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useContext } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import type { colorThemeValidation as schema } from "../validation";

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
  const { setValue } = useFormContext<z.infer<typeof schema>>();

  return useMutation({
    mutationFn: async (values: { context?: string; modelId?: string }) =>
      await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to generate data. Please try again later.");
        }

        return res.json() as Promise<z.infer<typeof schema>>;
      }),
    onSuccess: (data) => {
      const formattedData = JSON.stringify(data, null, 2);

      setValue("variables", formattedData);
      toast.success("Theme generated successfully!");
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
