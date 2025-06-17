import { Check, FilterIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { eventHandler } from "../../../lib/eventHandler";
import { useLogs } from "../providers";

export type FilterComponent = {
  filterOptions: string[];
  filterKey: "methods" | "sessions";
  selectedFilters: string[] | null;
};

export function FilterComponent({
  filterOptions,
  filterKey,
  selectedFilters,
}: FilterComponent) {
  const { toggleFilterValue, setSelected } = useLogs();

  if (!filterOptions) return <></>;

  const filters = new Set(selectedFilters);

  const isAllSelected = filters.size === filterOptions.length;

  const handleSelectAll = eventHandler(() => {
    toggleFilterValue(filterKey, isAllSelected ? [] : filterOptions);
    setSelected(null);
  });

  const handleSelectMethod = (method: string) =>
    eventHandler(() => {
      toggleFilterValue(filterKey, isAllSelected ? [method] : method);
      setSelected(null);
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-max has-[>svg]:px-1.5 py-1.5 cursor-pointer hover:bg-muted-foreground/20 text-secondary-foreground/70 dark:hover:text-accent-foreground data-[state=open]:text-accent-foreground dark:data-[state=open]:text-accent-foreground data-[state=open]:bg-muted-foreground/20"
        >
          <FilterIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start" alignOffset={-1}>
        <DropdownMenuItem
          onClick={handleSelectAll}
          onKeyDown={handleSelectAll}
          className="cursor-pointer"
        >
          <Check className={isAllSelected ? "visible" : "invisible"} />
          Select All
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {filterOptions.map((method) => (
          <DropdownMenuItem
            key={method}
            onClick={handleSelectMethod(method)}
            onKeyDown={handleSelectMethod(method)}
            className="cursor-pointer"
          >
            <Check
              className={
                !isAllSelected && filters.has(method) ? "visible" : "invisible"
              }
            />
            {method}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
