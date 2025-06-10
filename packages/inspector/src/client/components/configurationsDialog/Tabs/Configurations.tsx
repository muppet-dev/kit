import { eventHandler } from "../../../lib/eventHandler";
import { cn, SortingEnum } from "../../../lib/utils";
import { useConfig } from "../../../providers";
import type { ConnectionInfo } from "../../../providers/connection/manager";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "../../../validations";
import { Transport } from "@muppet-kit/shared";
import { ListX, MoveDown, MoveUp, Trash } from "lucide-react";
import { useState } from "react";
import { useConfigForm } from "../../ConfigForm/useConfigForm";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

export function Configurations() {
  const [selected, setSelected] = useState<ConnectionInfo>();
  const {
    clearAllConfigurations,
    deleteConfiguration,
    configurations,
    localSavedConfigs,
    configurationsSort,
    toggleConfigurationsSort,
  } = useConfig();

  const handleSelectItem = (value: ConnectionInfo) =>
    eventHandler(() => {
      const formattedData =
        value?.type === Transport.STDIO
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

  const handleDeleteItem = (name?: string) =>
    eventHandler(() => {
      deleteConfiguration(name);
    });

  const handleAllDelete = eventHandler(() => clearAllConfigurations());

  const handleToggleConfigurations = eventHandler(() =>
    toggleConfigurationsSort()
  );

  return (
    <div className="flex flex-col gap-6 justify-between h-full w-full overflow-hidden">
      {configurations && configurations.length > 0 ? (
        <div className="flex flex-col gap-2 overflow-y-auto w-full h-[364px]">
          {configurations.map((item) => {
            const content =
              item.type === Transport.STDIO
                ? `${item.command} ${item.args}`
                : item.url;

            return (
              <div
                key={item.name}
                onClick={handleSelectItem(item)}
                onKeyDown={handleSelectItem(item)}
                className={cn(
                  selected?.name === item.name
                    ? "bg-accent/80 border-primary/30"
                    : "hover:bg-accent/80 hover:border-primary/30 transition-all",
                  "relative border pl-3 pr-[54px] pt-1.5 pb-2 rounded-md cursor-pointer flex items-center justify-between select-none w-full"
                )}
              >
                <div className="w-full flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5 w-full">
                    <h3>{item.name}</h3>
                    <Badge
                      className={cn(
                        "leading-tight py-0 px-1 font-semibold",
                        item.type === Transport.HTTP
                          ? "bg-success"
                          : item.type === Transport.SSE
                          ? "bg-warning"
                          : "bg-info"
                      )}
                    >
                      {item.type === Transport.HTTP ? (
                        "HTTP Streaming"
                      ) : (
                        <span className="uppercase">{item.type}</span>
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
                  colorScheme="destructive"
                  className="absolute right-3 size-max has-[>svg]:px-1.5 py-1.5"
                  onClick={handleDeleteItem(item.name)}
                  onKeyDown={handleDeleteItem(item.name)}
                >
                  <Trash className="stroke-2" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground border">
          No saved connections found.
        </div>
      )}
      <div className="flex items-center gap-2">
        {localSavedConfigs != null && localSavedConfigs.length !== 0 && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="size-max has-[>svg]:px-1.5 py-1.5"
                  colorScheme="destructive"
                  onClick={handleAllDelete}
                  onKeyDown={handleAllDelete}
                >
                  <ListX />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Local Configs</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  colorScheme="secondary"
                  className="size-max has-[>svg]:px-1.5 py-1.5"
                  onClick={handleToggleConfigurations}
                  onKeyDown={handleToggleConfigurations}
                >
                  {configurationsSort === SortingEnum.ASCENDING && (
                    <MoveUp className="size-3.5" />
                  )}
                  {configurationsSort === SortingEnum.DESCENDING && (
                    <MoveDown className="size-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle sort order</TooltipContent>
            </Tooltip>
          </>
        )}
        <div className="flex-1" />
        <Button
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
