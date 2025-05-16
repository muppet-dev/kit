import { CodeHighlighter } from "@/client/components/Hightlighter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/client/components/ui/select";
import { Skeleton } from "@/client/components/ui/skeleton";
import { numberFormatter } from "@/client/lib/utils";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { JSONRender } from "./JSONRender";
import { useCustomForm } from "./provider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { eventHandler } from "@/client/lib/eventHandler";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";

enum Format {
  JSON = "json",
  RAW = "raw",
}

export type ReponsePanel = {
  isExpend: boolean;
  setExpend: (value: React.SetStateAction<boolean>) => void;
};

export function ReponsePanel({ isExpend, setExpend }: ReponsePanel) {
  const [dataFormat, setDataFormat] = useState<Format>(Format.JSON);
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  const handleExpendResponse = eventHandler(() => setExpend((prev) => !prev));

  if (isSubmitting || isSubmitSuccessful)
    return (
      <div className="h-full flex flex-col gap-2 overflow-y-auto pt-2 border-t">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Response</h2>
          <span className="text-xs text-green-600 font-medium dark:text-green-400">
            {isSubmitting ? (
              <Skeleton className="w-14 h-5" />
            ) : (data?.duration ?? 0) > 1000 ? (
              `${numberFormatter(
                Number(((data?.duration ?? 0) / 1000).toFixed(2)),
                "decimal"
              )} s`
            ) : (
              `${numberFormatter(data?.duration ?? 0, "decimal")} ms`
            )}
          </span>
          <div className="flex-1" />
          <Select
            onValueChange={(val) => setDataFormat(val as Format)}
            disabled={isSubmitting}
          >
            <SelectTrigger size="sm">
              {dataFormat === Format.JSON ? "JSON" : "Raw"}
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value={Format.JSON}>JSON</SelectItem>
              <SelectItem value={Format.RAW}>Raw</SelectItem>
            </SelectContent>
          </Select>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-max has-[>svg]:px-1.5 p-1.5"
                onClick={handleExpendResponse}
                onKeyDown={handleExpendResponse}
              >
                {isExpend ? (
                  <ChevronDown className="size-5" />
                ) : (
                  <ChevronUp className="size-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isExpend ? "Collapse response panel" : "Expand response panel"}
            </TooltipContent>
          </Tooltip>
        </div>
        {isSubmitting ? (
          <Skeleton className="size-full" />
        ) : (
          <div className="overflow-y-auto flex-1 space-y-2">
            {dataFormat === "raw" && (
              <CodeHighlighter
                content={JSON.stringify(data?.content, null, 2)}
              />
            )}
            {dataFormat === "json" && <JSONRender content={data?.content} />}
          </div>
        )}
      </div>
    );
}
