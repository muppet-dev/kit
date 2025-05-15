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

enum Format {
  JSON = "json",
  RAW = "raw",
}

export function ReponsePanel() {
  const [dataFormat, setDataFormat] = useState<Format>(Format.JSON);
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  if (isSubmitting || isSubmitSuccessful)
    return (
      <div className="h-full flex flex-col gap-2 overflow-y-auto pt-2 border-t">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Response</h2>
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
        </div>
        {isSubmitting ? (
          <Skeleton className="size-full" />
        ) : (
          <div className="overflow-y-auto flex-1">
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
