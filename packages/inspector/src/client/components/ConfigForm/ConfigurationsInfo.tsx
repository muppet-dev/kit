import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { CONFIG_STORAGE_KEY } from "@/client/providers";
import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { DocumentSubmitType, SUBMIT_BUTTON_KEY } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { Trash } from "lucide-react";
import { useState } from "react";
import type { ConfigForm } from ".";
import { Button } from "../ui/button";
import { useConfigForm } from "./useConfigForm";

export function ConfigurationsInfo({ onSubmit }: Pick<ConfigForm, "onSubmit">) {
  const [selected, setSelected] = useState<ConnectionInfo>();

  const configurations = localStorage.getItem(CONFIG_STORAGE_KEY);

  const localStorageData = configurations
    ? (JSON.parse(configurations) as ConnectionInfo[])
    : undefined;

  const onSetForm = (value: ConnectionInfo) =>
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

  const mutation = useConfigForm({ onSubmit });

  const handleSave = eventHandler(() => {
    if (selected)
      mutation.mutateAsync({
        ...selected,
        [SUBMIT_BUTTON_KEY]: DocumentSubmitType.CONNECT,
      });
  });

  const onDelete = (id?: string) =>
    eventHandler(() => {
      if (id) {
        localStorage.removeItem(CONFIG_STORAGE_KEY);

        const data = localStorageData?.filter(
          ({ id: itemId }) => String(itemId) !== id
        );

        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(data));
      }
    });

  return (
    <div className="flex flex-col gap-2 justify-between h-full overflow-hidden">
      {localStorageData && localStorageData.length > 0 ? (
        <div className="space-y-2 max-h-[388px] h-full overflow-y-auto">
          {localStorageData.map((value, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              onClick={onSetForm(value)}
              onKeyDown={onSetForm(value)}
              className={cn(
                selected?.id === value.id
                  ? "bg-accent/80 dark:bg-accent/50 border-primary/30"
                  : "hover:bg-accent/80 dark:hover:bg-accent/50 hover:border-primary/30 transition-all",
                "border px-3 py-1.5 cursor-pointer flex items-center justify-between"
              )}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3>
                    {(value.name?.length ?? 0) > 0 ? value.name : value.id}
                  </h3>{" "}
                  -<p>{value.transportType}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {value.transportType === Transport.STDIO
                    ? value.command
                    : value.url}
                </p>
              </div>
              <Button
                variant="ghost"
                className="size-max has-[>svg]:px-2 py-2 dark:hover:!bg-red-300/30 dark:!text-red-300 !text-red-500 hover:!bg-red-300/90"
                onClick={onDelete(value.id)}
                onKeyDown={onDelete(value.id)}
              >
                <Trash className="stroke-2" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center flex items-center justify-center h-full text-sm text-muted-foreground border p-4">
          No saved connections found.
        </div>
      )}
      <div className="flex items-center justify-end">
        <Button
          className="ml-auto"
          disabled={!selected}
          onClick={handleSave}
          onKeyDown={handleSave}
        >
          Connect
        </Button>
      </div>
    </div>
  );
}
