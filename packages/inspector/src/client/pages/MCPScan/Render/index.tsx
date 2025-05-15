import { useMemo, useState } from "react";
import { useMCPScan } from "../providers";
import { Skeleton } from "@/client/components/ui/skeleton";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { ScanButton } from "../ScanButton";
import { StatusPanel } from "./StatusPanel";
import { VulnerabilityItem } from "./VulnerabilityItem";

export function PageRender() {
  const [filter, setFilter] = useState<
    "tool" | "prompt" | "resource" | undefined
  >();
  const mutation = useMCPScan();

  const data = useMemo(() => {
    let data = mutation.data?.tools;
    if (filter) data = data?.filter((item) => item.type === filter);
    return data;
  }, [filter, mutation]);

  return (
    <div className="overflow-auto">
      <div className="mx-auto max-w-2xl lg:max-w-7xl w-full flex gap-4 lg:gap-6">
        <div className="bg-muted/50 border p-4 lg:p-6 size-full flex flex-col gap-2 lg:gap-3">
          {mutation.isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`vulnerability-${index + 1}`}
                className="w-full h-[161px]"
              />
            ))
          ) : mutation.data ? (
            mutation.data.tools.length > 0 ? (
              <>
                <div className="mb-2 lg:mb-3 flex items-center gap-1 lg:gap-2">
                  <ShieldAlert className="size-7 text-red-500 dark:text-red-300" />
                  <h2 className="text-2xl font-semibold">
                    Vulnerabilities Detected
                  </h2>
                </div>
                {data?.length === 0 ? (
                  <div className="h-[100px] w-full border flex items-center justify-center select-none text-sm text-muted-foreground">
                    No data found {filter ? `for ${filter}` : ""}
                  </div>
                ) : (
                  data?.map((item, index) => (
                    <VulnerabilityItem
                      key={`vulnerability-group-${index + 1}`}
                      {...item}
                    />
                  ))
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] gap-4 lg:gap-6">
                <ShieldCheck className="size-32 text-green-500 dark:text-green-300" />
                <h2 className="text-2xl font-semibold mb-2 lg:mb-3 max-w-2xl text-center">
                  No Vulnerabilities Detected
                </h2>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center w-full gap-3 lg:gap-5">
              <Shield className="size-32" />
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl max-w-2xl mx-auto text-center">
                Check for potential security vulnerabilities
              </h2>
              <ScanButton className="text-lg [&>svg]:size-5 [&>svg]:min-h-5 [&>svg]:min-w-5 py-2 has-[>svg]:px-4 mt-2" />
            </div>
          )}
        </div>
        <StatusPanel
          filter={filter}
          onFilterChange={(filter) => {
            if (mutation.data)
              setFilter((prev) => (prev === filter ? undefined : filter));
          }}
        />
      </div>
    </div>
  );
}
