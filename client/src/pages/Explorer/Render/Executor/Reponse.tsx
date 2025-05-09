import { CodeHighlighter } from "@/components/Hightlighter";
import { Skeleton } from "@/components/ui/skeleton";
import { numberFormatter } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { useCustomForm } from "./provider";

export function ReponsePanel() {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  if (isSubmitting || isSubmitSuccessful)
    return (
      <div className="h-full flex flex-col gap-2 overflow-y-auto pt-2 border-t">
        <div className="flex">
          <h2 className="text-sm font-semibold">Response</h2>
          <div className="flex-1" />
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
          <CodeHighlighter content={JSON.stringify(data?.content, null, 2)} />
        )}
      </div>
    );
}
