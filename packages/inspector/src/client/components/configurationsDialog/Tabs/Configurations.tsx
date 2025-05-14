import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { CONFIG_STORAGE_KEY } from "@/client/providers";
import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Trash } from "lucide-react";
import { useMemo, useState } from "react";
import { useConfigForm } from "../../ConfigForm/useConfigForm";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";

export function Configurations() {
  const [selected, setSelected] = useState<ConnectionInfo>();
  const [configurations, setConfigurations] = useLocalStorage<
    ConnectionInfo[] | null
  >(CONFIG_STORAGE_KEY);

  const handleSelectItem = (value: ConnectionInfo) =>
    eventHandler(() => {
      const formattedData =
        value?.transportType === Transport.STDIO
          ? {
              ...value,
              env: value.env
                ? typeof value.env === "string"
                  ? Object.entries(JSON.parse(value.env)).map(
                      ([key, value]) => ({
                        key,
                        value: String(value),
                      })
                    )
                  : value.env
                : undefined,
            }
          : value;

      setSelected(formattedData);
    });

  const mutation = useConfigForm();

  const handleConnect = eventHandler(() => {
    if (selected)
      mutation.mutateAsync({
        ...selected,
        [SUBMIT_BUTTON_KEY]: DocumentSubmitType.CONNECT,
      });
  });

  const handleDeleteItem = (id?: string) =>
    eventHandler(() => {
      if (id) {
        setConfigurations(
          (prev) => prev?.filter((item) => item.id !== id) ?? []
        );
      }
    });

  return (
    <div className="flex flex-col gap-6 justify-between h-full w-full overflow-hidden">
      {configurations && configurations.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-[364px] h-full overflow-y-auto w-full">
          {configurations.map((item) => {
            const content =
              item.transportType === Transport.STDIO
                ? `${item.command} ${item.args}`
                : item.url;

            return (
              <div
                key={item.id}
                onClick={handleSelectItem(item)}
                onKeyDown={handleSelectItem(item)}
                className={cn(
                  selected?.id === item.id
                    ? "bg-accent/80 dark:bg-accent/50 border-primary/30"
                    : "hover:bg-accent/80 dark:hover:bg-accent/50 hover:border-primary/30 transition-all",
                  "relative border pl-3 pr-[54px] pt-1.5 pb-2 cursor-pointer flex items-center justify-between select-none w-full"
                )}
              >
                <div className="w-full flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5 w-full">
                    <h3>
                      {(item.name?.length ?? 0) > 0 ? item.name : item.id}
                    </h3>
                    <Badge
                      className={cn(
                        "leading-tight py-0 px-1 font-semibold",
                        item.transportType === Transport.HTTP
                          ? "bg-green-500 dark:bg-green-300"
                          : item.transportType === Transport.SSE
                          ? "bg-yellow-500 dark:bg-yellow-300"
                          : "bg-blue-500 dark:bg-blue-300"
                      )}
                    >
                      {item.transportType === Transport.HTTP ? (
                        "HTTP Streaming"
                      ) : (
                        <span className="uppercase">{item.transportType}</span>
                      )}
                    </Badge>
                  </div>
                  <p
                    className="text-sm leading-tight text-muted-foreground truncate"
                    title={content}
                  >
                    {content}
                  </p>
                </div>
                <Button
                  title="Delete item"
                  variant="ghost"
                  className="absolute right-3 size-max has-[>svg]:px-1.5 py-1.5 text-red-500 dark:text-red-300 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-300/20"
                  onClick={handleDeleteItem(item.id)}
                  onKeyDown={handleDeleteItem(item.id)}
                >
                  <Trash className="stroke-2" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground border mr-4">
          No saved connections found.
        </div>
      )}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          disabled={!selected || mutation.isPending}
          onClick={handleConnect}
          onKeyDown={handleConnect}
        >
          {mutation.isPending && <Spinner className="size-4 min-w-4 min-h-4" />}
          {mutation.isPending ? "Connecting" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
