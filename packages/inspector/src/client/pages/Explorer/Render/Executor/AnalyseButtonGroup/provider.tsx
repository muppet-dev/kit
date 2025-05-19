import type { MCPItemType } from "../../../../../pages/Explorer/types";
import { useConfig } from "../../../../../providers";
import { useMutation } from "@tanstack/react-query";
import { type PropsWithChildren, createContext, useContext } from "react";
import toast from "react-hot-toast";

type AnalyseContextType = ReturnType<typeof useAnalyseManager>;

const AnalyseContext = createContext<AnalyseContextType | null>(null);

export const AnalyseProvider = (props: PropsWithChildren) => {
  const values = useAnalyseManager();

  return (
    <AnalyseContext.Provider value={values}>
      {props.children}
    </AnalyseContext.Provider>
  );
};

export enum AnalyseSeverity {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export type AnalyseDataType = {
  score: number;
  recommendations: {
    category: string;
    description: string;
    severity: AnalyseSeverity;
  }[];
};

function useAnalyseManager() {
  const { proxyAddress } = useConfig();

  return useMutation({
    mutationFn: async (values: MCPItemType & { context?: string }) =>
      fetch(`${proxyAddress}/api/analyse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch analysis data. Please try again.");
        }

        return res.json() as Promise<AnalyseDataType>;
      }),
    onSuccess: () => {
      toast.success("Analysis completed successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });
}

export const useAnalyse = () => {
  const context = useContext(AnalyseContext);

  if (!context) throw new Error("Missing AnalyseContext.Provider in the tree!");

  return context;
};
