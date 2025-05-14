import { Button } from "@/client/components/ui/button";
import { Skeleton } from "@/client/components/ui/skeleton";
import { Spinner } from "@/client/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn, numberFormatter } from "@/client/lib/utils";
import {
  Clock,
  Play,
  RotateCcw,
  Shield,
  SquareArrowOutUpRight,
  TriangleAlert,
} from "lucide-react";
import { MCPScanProvider, useMCPScan } from "./providers";
import { useMemo, useState } from "react";

export default function MCPScanPage() {
  const [isScanned, setIsScanned] = useState(false);

  return (
    <MCPScanProvider>
      <div className="p-4 size-full flex flex-col gap-4">
        <PageHeader isScanned={isScanned} onScan={() => setIsScanned(true)} />
        <Render isScanned={isScanned} />
      </div>
    </MCPScanProvider>
  );
}

function PageHeader(props: { isScanned: boolean; onScan: () => void }) {
  const mutation = useMCPScan();
  const handleScan = eventHandler(async () => {
    props.onScan();
    await mutation.mutateAsync();
  });

  return (
    <div className="flex items-center gap-2">
      <Shield className="size-6" />
      <h2 className="text-2xl font-bold">MCP Scan</h2>
      <PoweredBy />
      <div className="flex-1" />
      <Button
        disabled={mutation.isPending}
        onClick={handleScan}
        onKeyDown={handleScan}
        className="h-max py-1.5"
      >
        {mutation.isPending ? (
          <Spinner className="size-4 min-w-4 min-h-4" />
        ) : (
          props.isScanned && <RotateCcw />
        )}
        {mutation.isPending
          ? "Scanning"
          : mutation.isSuccess
          ? "Rescan"
          : "Start"}
        {!props.isScanned && <Play className="size-3.5" />}
      </Button>
    </div>
  );
}

function PoweredBy() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <a href="https://invariantlabs.ai/" target="_blank" rel="noreferrer">
          <div className="flex items-center gap-1 p-1.5 border shadow-md dark:bg-muted/50 ml-2">
            <img
              src="https://invariantlabs.ai/theme/images/logo.svg"
              alt="Invariant Labs Logo"
              className="size-3.5"
            />
            <img
              src="https://invariantlabs.ai/theme/images/logo-font-dark.svg"
              about="Invariant Labs Logo"
              alt="Invariant Labs"
              className="dark:hidden h-2.5"
            />
            <img
              src="https://invariantlabs.ai/theme/images/logo-font-light.svg"
              about="Invariant Labs Logo"
              alt="Invariant Labs"
              className="hidden dark:block h-2.5"
            />
          </div>
        </a>
      </TooltipTrigger>
      <TooltipContent>Powered by Invariant Labs</TooltipContent>
    </Tooltip>
  );
}

function Render(props: { isScanned: boolean }) {
  const [filter, setFilter] = useState<
    "tool" | "prompt" | "resource" | undefined
  >();
  const mutation = useMCPScan();

  const data = useMemo(() => {
    let data = mutation.data?.tools;
    if (filter) data = data?.filter((item) => item.type === filter);
    return data;
  }, [filter, mutation]);

  const handleFilter = (filter: "tool" | "prompt" | "resource") =>
    mutation.data
      ? eventHandler(() =>
          setFilter((prev) => (prev === filter ? undefined : filter))
        )
      : undefined;

  if (props.isScanned)
    return (
      <div className="overflow-auto">
        <div className="mx-auto max-w-2xl lg:max-w-7xl w-full flex gap-4 lg:gap-6">
          <div className="bg-muted/50 border p-4 lg:p-6 size-full flex flex-col gap-2 lg:gap-3">
            <h2 className="text-2xl font-semibold mb-2 lg:mb-3">
              Vulnerabilities Detected
            </h2>
            {mutation.isPending ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={`vulnerability-${index + 1}`}
                  className="w-full h-[100px]"
                />
              ))
            ) : data?.length === 0 ? (
              <div className="h-[100px] w-full border flex items-center justify-center select-none text-sm text-muted-foreground">
                No data found {filter ? `for ${filter}` : ""}
              </div>
            ) : (
              data?.map((item, index) => (
                <div
                  key={`vulnerability-group-${index + 1}`}
                  className="w-full bg-background p-[inherit]"
                >
                  <div className="flex items-center justify-between mb-1 lg:mb-2">
                    <p className="font-medium">{item.name}</p>
                    <p
                      className={cn(
                        "text-sm px-1.5 pt-0.5 pb-1 leading-none capitalize text-white dark:text-black",
                        item.type === "tool"
                          ? "bg-green-500 dark:bg-green-300"
                          : item.type === "prompt"
                          ? "bg-yellow-500 dark:bg-yellow-300"
                          : "bg-blue-500 dark:bg-blue-300"
                      )}
                    >
                      {item.type}
                    </p>
                  </div>
                  {item.errors.map((error, i) => (
                    <div
                      key={`vulnerability-group-${index + 1}-error-${i + 1}`}
                      className="text-sm text-muted-foreground"
                    >
                      - {error}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
          <div className="bg-muted/50 border p-4 lg:p-6 min-w-[400px] max-w-[400px] w-full h-full flex flex-col gap-4 lg:gap-6">
            <div className="w-full space-y-2 lg:space-y-3">
              <h3 className="text-2xl font-semibold">Security Status</h3>
              <div className="flex items-center gap-1.5">
                <TriangleAlert className="size-[18px]" />
                <p>Threats</p>
                <div className="flex-1" />
                {mutation.isPending ? (
                  <Skeleton className="w-10 h-6" />
                ) : (
                  <p className="text-muted-foreground">
                    {mutation.data?.tools.length}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-[18px]" />
                <p>Scan Time</p>
                <div className="flex-1" />
                {mutation.isPending ? (
                  <Skeleton className="w-10 h-6" />
                ) : (
                  <p className="text-muted-foreground">
                    {(mutation.data?.duration ?? 0) > 1000
                      ? `${numberFormatter(
                          Number(
                            ((mutation.data?.duration ?? 0) / 1000).toFixed(2)
                          ),
                          "decimal"
                        )} s`
                      : `${numberFormatter(
                          mutation.data?.duration ?? 0,
                          "decimal"
                        )} ms`}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full h-px bg-border" />
            <div className="w-full space-y-2 lg:space-y-3">
              <h4 className="text-xl font-semibold">Threat Summary</h4>
              <div className="grid grid-cols-3 gap-1 lg:gap-2">
                <div
                  className={cn(
                    "w-full h-[111px] select-none flex flex-col gap-0.5 lg:gap-1 items-center justify-center bg-background cursor-pointer border transition-all ease-in-out",
                    filter === "tool"
                      ? "border-accent-foreground"
                      : "border-transparent"
                  )}
                  onClick={handleFilter("tool")}
                  onKeyDown={handleFilter("tool")}
                >
                  {mutation.isPending ? (
                    <Skeleton className="h-8 w-4" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {
                        mutation.data?.tools.filter(
                          (item) => item.type === "tool"
                        ).length
                      }
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">Tool</p>
                </div>
                <div
                  className={cn(
                    "w-full h-[111px] select-none flex flex-col gap-0.5 lg:gap-1 items-center justify-center bg-background cursor-pointer border transition-all ease-in-out",
                    filter === "prompt"
                      ? "border-accent-foreground"
                      : "border-transparent"
                  )}
                  onClick={handleFilter("prompt")}
                  onKeyDown={handleFilter("prompt")}
                >
                  {mutation.isPending ? (
                    <Skeleton className="h-8 w-4" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {
                        mutation.data?.tools.filter(
                          (item) => item.type === "prompt"
                        ).length
                      }
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">Prompt</p>
                </div>
                <div
                  className={cn(
                    "w-full h-[111px] select-none flex flex-col gap-0.5 lg:gap-1 items-center justify-center bg-background cursor-pointer border transition-all ease-in-out",
                    filter === "resource"
                      ? "border-accent-foreground"
                      : "border-transparent"
                  )}
                  onClick={handleFilter("resource")}
                  onKeyDown={handleFilter("resource")}
                >
                  {mutation.isPending ? (
                    <Skeleton className="h-8 w-4" />
                  ) : (
                    <p className="text-2xl font-bold">
                      {
                        mutation.data?.tools.filter(
                          (item) => item.type === "resource"
                        ).length
                      }
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">Resource</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return <WelcomeGrid />;
}

function WelcomeGrid() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p className="max-w-2xl mx-auto text-center text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Check for potential security vulnerabilities
        </p>
        <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-3 lg:grid-rows-2">
          <div className="lg:row-span-2 shadow ring-1 ring-border">
            <div className="flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 py-8 sm:px-10 sm:py-10">
                <a
                  href="https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 w-max"
                  aria-label="Read more about MCP security notification tool poisoning attacks on Invariant Labs blog"
                >
                  <p className="text-lg font-semibold tracking-tight max-lg:text-center">
                    Tool Poisoning
                  </p>
                  <SquareArrowOutUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity ease-in-out" />
                </a>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground max-lg:text-center">
                  Hidden malicious instructions embedded in MCP tool
                  descriptions.
                </p>
              </div>
            </div>
          </div>
          <div className="max-lg:row-start-1 shadow ring-1 ring-border">
            <div className="flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 py-8 sm:px-10 sm:py-10">
                <p className="text-lg font-semibold tracking-tight max-lg:text-center">
                  MCP rug pulls
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground max-lg:text-center">
                  Unauthorized changes to MCP tool descriptions after initial
                  user approval.
                </p>
              </div>
            </div>
          </div>
          <div className="max-lg:row-start-3 lg:col-start-2 lg:row-start-2 shadow ring-1 ring-border">
            <div className="flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 py-8 sm:px-10 sm:py-10">
                <p className="text-lg font-semibold tracking-tight max-lg:text-center">
                  Cross-origin escalations
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground max-lg:text-center">
                  Shadowing attacks that compromise trusted tools through
                  malicious descriptions.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:row-span-2 shadow ring-1 ring-border">
            <div className="flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 py-8 sm:px-10 sm:py-10">
                <p className="text-lg font-semibold tracking-tight max-lg:text-center">
                  Prompt Injection Attacks
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-muted-foreground max-lg:text-center">
                  Malicious instructions contained within tool descriptions that
                  could be executed by the agent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
