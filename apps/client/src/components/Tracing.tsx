import { useConnection } from "@/providers";
import { CodeHighlighter } from "./Hightlighter";
import { ArchiveX } from "lucide-react";

export function TracingPage() {
  const { requestHistory } = useConnection();

  console.log(requestHistory);

  return (
    <div className="p-4 w-full flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-2xl font-bold">Traces</h2>
      <div className="h-full w-full overflow-y-auto">
        {requestHistory.length > 0 ? (
          <div className="flex flex-col gap-1">
            {requestHistory.map((item, index) => {
              const response = item.response
                ? JSON.stringify(JSON.parse(item.response), null, 2)
                : undefined;

              return (
                <div
                  key={`request.${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                >
                  <p className="mb-1 text-sm text-muted-foreground">
                    {item.request}
                  </p>
                  {response && (
                    <div className="[&>div>pre]:p-2 [&>div>pre]:rounded-lg [&>div>pre]:border">
                      <CodeHighlighter content={response} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="size-full flex items-center justify-center gap-1.5 text-muted-foreground select-none">
            <ArchiveX className="size-4" />
            <p className="text-sm">No history found</p>
          </div>
        )}
      </div>
    </div>
  );
}
