import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import { ScanButton } from "../ScanButton";
import { useMCPScan } from "../providers";
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
        <div className="bg-muted/50 border p-4 lg:p-6 size-full flex flex-col gap-2 lg:gap-3 rounded-lg">
          {mutation.isPending ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`vulnerability-${index + 1}`}
                className="w-full h-[120px] rounded-md"
              />
            ))
          ) : mutation.data ? (
            mutation.data.tools.length > 0 ? (
              <>
                <div className="mb-2 lg:mb-3 flex items-center gap-1 lg:gap-2">
                  <ShieldAlert className="size-7 text-destructive" />
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
              <div className="flex flex-col items-center justify-center w-full gap-2 lg:gap-4 h-[525px]">
                <ShieldCheck className="size-32 text-success" />
                <h2 className="text-balance font-medium tracking-tight text-2xl max-w-2xl text-center text-muted-foreground">
                  No Vulnerabilities Detected
                </h2>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center w-full gap-3 lg:gap-5 h-[525px]">
              <h2 className="text-balance font-medium tracking-tight text-2xl max-w-lg text-center text-muted-foreground">
                Check for Potential
                <br /> Security Vulnerabilities
              </h2>
              <ScanButton className="text-base [&>svg]:size-4 [&>svg]:min-h-4 [&>svg]:min-w-4" />
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
