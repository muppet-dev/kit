import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";
import { AVAILABLE_METHODS, useTracing } from "../providers";

export function FilterMethod() {
  const { methodFilters, changeMethodFilters } = useTracing();
  const filters = new Set(methodFilters);

  const isAllSelected = filters.size === AVAILABLE_METHODS.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FilterIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start">
        <DropdownMenuCheckboxItem
          checked={isAllSelected}
          onCheckedChange={() =>
            changeMethodFilters(isAllSelected ? [] : AVAILABLE_METHODS)
          }
        >
          Select All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {AVAILABLE_METHODS.map((method) => (
          <DropdownMenuCheckboxItem
            checked={!isAllSelected && filters.has(method)}
            key={method}
            onCheckedChange={() =>
              changeMethodFilters(isAllSelected ? [method] : method)
            }
          >
            {method}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
