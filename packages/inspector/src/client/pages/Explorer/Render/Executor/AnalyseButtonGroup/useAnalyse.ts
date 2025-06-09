import { useConfig } from "@/client/providers";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useMCPItem, useTool } from "../../../providers";

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

export type AnalyseProps = {
  model?: string | undefined;
  context?: string | undefined;
};

export function useAnalyse(props?: AnalyseProps) {
  const { activeTool } = useTool();
  const { proxyAddress } = useConfig();
  const { selectedItem } = useMCPItem();

  const { context, model } = props ?? {};

  let requestURL = `${proxyAddress}/api/analyse`;

  if (model) requestURL += `?modelId=${model}`;

  return useQuery({
    queryKey: ["analyse", activeTool.name, selectedItem?.name],
    queryFn: async () =>
      fetch(requestURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedItem, context }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch analysis data. Please try again.");
          }

          return res.json() as Promise<AnalyseDataType>;
        })
        .catch((err) => {
          toast.error(err.message);
          console.error(err);
        }),
    enabled: false,
  });
}
