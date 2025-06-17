import Fuse from "fuse.js";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { useConfig } from "../providers";
import { PROVIDER_ICONS } from "./icons";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type ModelField = {
  value?: string;
  onChange: (value?: string) => void;
  className?: string;
};

export function ModelField({ onChange, value, className }: ModelField) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [contentWidth, setContentWidth] = useState(0);
  const [search, setSearch] = useState<string>();
  const { getAvailableModels } = useConfig();

  const [provider, name] = value?.split(":") ?? "";
  const SelectedModelIcon = PROVIDER_ICONS[provider];

  const searchResults = useMemo<
    {
      id: string;
      provider: string;
      name: string;
    }[]
  >(() => {
    const _models = getAvailableModels();
    const items = _models.map((item) => {
      const [provider, name] = item.split(":");

      return {
        id: item,
        provider,
        name,
      };
    });

    if (!search?.trim() || items.length === 0) return items;

    const fuse = new Fuse(items, {
      keys: ["provider", "name"],
    });

    return fuse.search(search).map(({ item }) => item);
  }, [getAvailableModels, search]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (triggerRef.current) {
      setContentWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[300px] justify-start data-[state=closed]:hover:[&>svg]:opacity-100 data-[state=open]:[&>svg]:opacity-100 transition-all ease-in-out [&>svg]:transition-all [&>svg]:ease-in-out",
            className,
          )}
          ref={triggerRef}
        >
          <SelectedModelIcon className="size-4" />
          <p>
            {provider} {name}
          </p>
          <div className="flex-1" />
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: contentWidth }}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search LLM"
            value={search}
            onValueChange={setSearch}
          />
          <CommandGroup>
            <CommandEmpty>No result found for `{search}`</CommandEmpty>
            <CommandList>
              {searchResults.map((item) => {
                const Icon = PROVIDER_ICONS[item.provider];

                return (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      onChange(item.id);
                      setIsOpen(false);
                    }}
                  >
                    <Icon />
                    <p>
                      {item.provider} {item.name}
                    </p>
                    <div className="flex-1" />
                    <Check
                      className={cn(
                        "size-4",
                        item.id === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
