import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";
import type { TracingTable } from ".";

const FILTER_OPTIONS = [
  "initialize",
  "ping",
  "tools/list",
  "tools/call",
  "resources/list",
  "resources/read",
  "prompts/list",
  "prompts/get",
  "resources/templates/list",
  "completion/complete",
];

export type FilterMethod = {
  selectedFilters: Set<string>;
  setSelectedFilters: (value: React.SetStateAction<Set<string>>) => void;
};

export function FilterMethod({
  selectedFilters,
  setSelectedFilters,
}: FilterMethod) {
  const toggleFilter = (method: string) =>
    setSelectedFilters((prev) => {
      const updated = new Set(prev);
      if (updated.has(method)) {
        updated.delete(method);
      } else {
        updated.add(method);
      }
      return updated;
    });

  const methodsCount: number[] = [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FilterIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        {FILTER_OPTIONS.map((method, index) => (
          <DropdownMenuCheckboxItem
            checked={selectedFilters.has(method)}
            key={`${index}-${method}`}
            onCheckedChange={() => toggleFilter(method)}
          >
            {method}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
