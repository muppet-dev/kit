import { Skeleton } from "@/client/components/ui/skeleton";
import { cn } from "@/client/lib/utils";
import { useServerData } from "@/client/queries/useServerData";
import { useParams } from "react-router";
import { ConfigurationsForm } from "./Form";

export default function ServerConfigurationsPage() {
  const { serverId } = useParams();
  const { data } = useServerData({ id: serverId });

  console.log("ServerConfigurationsPage", data);

  return (
    <div className="py-4 size-full flex flex-col gap-4 overflow-auto">
      <div className="flex justify-between max-w-4xl mx-auto w-full">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">
            {data?.server.name}{" "}
            <span className="text-xs font-normal px-1 py-0.5 border bg-muted/80 text-foreground/80">
              {data?.server.type}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            {data?.server.url ?? `${data?.server.command} ${data?.server.args}`}
          </p>
        </div>
        <StatusBadge status={data?.server.status} />
      </div>
      <ConfigurationsForm data={data} />
    </div>
  );
}

function StatusBadge(props: { status?: "online" | "offline" }) {
  if (!props.status)
    return <Skeleton className="w-[60.7px] h-[22px] rounded-full" />;

  return (
    <div
      className={cn(
        "p-1 pr-1.5 flex items-center gap-1 rounded-full border h-max",
        props.status === "online"
          ? "bg-success/10 border-success/50 text-success [&>div]:bg-success"
          : "bg-destructive/10 border-destructive/50 text-destructive [&>div]:bg-destructive",
      )}
    >
      <div className="size-2.5 rounded-full" />
      <p className="text-xs leading-none capitalize">{props.status}</p>
    </div>
  );
}
