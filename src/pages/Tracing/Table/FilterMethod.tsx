import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";

export const FILTER_OPTIONS = [
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

  const selectAllToggle = () => {
    if (selectedFilters.size === FILTER_OPTIONS.length)
      setSelectedFilters(new Set());
    else setSelectedFilters(new Set(FILTER_OPTIONS));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FilterIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuCheckboxItem
          checked={selectedFilters.size === FILTER_OPTIONS.length}
          onCheckedChange={selectAllToggle}
        >
          Select All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
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
