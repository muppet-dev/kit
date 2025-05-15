import { CodeHighlighter } from "@/client/components/Hightlighter";
import { Skeleton } from "@/client/components/ui/skeleton";
import { numberFormatter } from "@/client/lib/utils";
import { useFormContext } from "react-hook-form";
import { useCustomForm } from "./provider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { JSONRender } from "./JSONRender";

export function ReponsePanel() {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
  } = useFormContext();

  const mutation = useCustomForm();
  const data = mutation.data;

  if (isSubmitting || isSubmitSuccessful)
    return (
      <Tabs
        className="h-full flex flex-col gap-2 overflow-y-auto pt-2 border-t"
        defaultValue="json"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Response</h2>
          <TabsList className="h-max">
            <TabsTrigger
              value="json"
              disabled={isSubmitting}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-0.5 text-sm px-2 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              JSON
            </TabsTrigger>
            <TabsTrigger
              value="raw"
              disabled={isSubmitting}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-0.5 text-sm px-2 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Raw
            </TabsTrigger>
          </TabsList>
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
          <>
            <TabsContent value="raw">
              <CodeHighlighter
                content={JSON.stringify(data?.content, null, 2)}
              />
            </TabsContent>
            <TabsContent value="json">
              <JSONRender content={data?.content} />
            </TabsContent>
          </>
        )}
      </Tabs>
    );
}
