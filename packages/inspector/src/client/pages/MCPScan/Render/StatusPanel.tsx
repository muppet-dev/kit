import { Clock, type LucideProps, TriangleAlert } from "lucide-react";
import type {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import { eventHandler } from "../../../lib/eventHandler";
import { cn, numberFormatter } from "../../../lib/utils";
import { useMCPScan } from "../providers";

export function StatusPanel(props: {
  filter: "tool" | "prompt" | "resource" | undefined;
  onFilterChange: (filter: "tool" | "prompt" | "resource") => void;
}) {
  const mutation = useMCPScan();

  return (
    <div className="bg-muted/50 border rounded-lg p-4 lg:p-6 min-w-[400px] max-w-[400px] w-full h-full flex flex-col gap-4 lg:gap-6 sticky top-0">
      <div className="w-full space-y-2 lg:space-y-3">
        <h3 className="text-2xl font-semibold">Security Status</h3>
        <StatusItem
          label="Threats"
          icon={TriangleAlert}
          data={mutation.data?.tools.length}
        />
        <StatusItem
          label="Scan Time"
          icon={Clock}
          data={
            (mutation.data?.duration ?? 0) > 1000
              ? `${numberFormatter(
                  Number(((mutation.data?.duration ?? 0) / 1000).toFixed(2)),
                  "decimal",
                )} s`
              : `${numberFormatter(mutation.data?.duration ?? 0, "decimal")} ms`
          }
        />
      </div>
      <div className="w-full h-px bg-border" />
      <div className="w-full space-y-2 lg:space-y-3">
        <h4 className="text-xl font-semibold">Threat Summary</h4>
        <div className="grid grid-cols-3 gap-1 lg:gap-2">
          <SummaryItem
            name="tool"
            filter={props.filter}
            onFilterChange={props.onFilterChange}
          />
          <SummaryItem
            name="prompt"
            filter={props.filter}
            onFilterChange={props.onFilterChange}
          />
          <SummaryItem
            name="resource"
            filter={props.filter}
            onFilterChange={props.onFilterChange}
          />
        </div>
      </div>
    </div>
  );
}

function StatusItem({
  icon: Icon,
  label,
  data,
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  data: ReactNode;
}) {
  const mutation = useMCPScan();

  return (
    <div className="flex items-center gap-1.5">
      <Icon className="size-[18px] text-muted-foreground" />
      <p className="text-muted-foreground">{label}</p>
      <div className="flex-1" />
      {mutation.isPending ? (
        <Skeleton className="w-10 h-6 rounded-sm" />
      ) : (
        <p>{mutation.data ? data : "-"}</p>
      )}
    </div>
  );
}

function SummaryItem(props: {
  name: "tool" | "prompt" | "resource";
  filter: "tool" | "prompt" | "resource" | undefined;
  onFilterChange: (filter: "tool" | "prompt" | "resource") => void;
}) {
  const mutation = useMCPScan();

  const stat = mutation.data?.tools.filter(
    (item) => item.type === props.name,
  ).length;

  const handleChangeFilter = (filter: "tool" | "prompt" | "resource") =>
    eventHandler(() => {
      if (!mutation.isPending) props.onFilterChange(filter);
    });

  return (
    <div
      className={cn(
        "w-full h-[111px] rounded-md select-none flex flex-col gap-0.5 lg:gap-1 items-center justify-center bg-background cursor-pointer border transition-all ease-in-out",
        props.filter === props.name
          ? "border-accent-foreground"
          : "border-transparent",
      )}
      onClick={handleChangeFilter(props.name)}
      onKeyDown={handleChangeFilter(props.name)}
    >
      {mutation.isPending ? (
        <Skeleton className="h-8 w-4 rounded-sm" />
      ) : (
        <p className="text-2xl">
          {mutation.data ? <span className="font-bold">{stat}</span> : "-"}
        </p>
      )}
      <p className="text-sm text-muted-foreground capitalize">
        {props.name}
        {(stat ?? 0) > 1 && "s"}
      </p>
    </div>
  );
}
