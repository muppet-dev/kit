import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { eventHandler } from "../../../lib/eventHandler";
import { Check, Filter } from "lucide-react";
import { useHistory } from "../providers";

export function FilterMethod() {
  const { methodFilters, tab, changeMethodFilters, setSelected } = useHistory();
  const filters = new Set(methodFilters);

  if (!tab.methods) return <></>;

  const isAllSelected = filters.size === tab.methods.length;

  const handleSelectAll = eventHandler(() => {
    changeMethodFilters(isAllSelected ? [] : tab.methods);
    setSelected(null);
  });

  const handleSelectMethod = (method: string) =>
    eventHandler(() => {
      changeMethodFilters(isAllSelected ? [method] : method);
      setSelected(null);
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-max has-[>svg]:px-1.5 py-1.5 cursor-pointer hover:bg-zinc-200 text-zinc-600 dark:hover:bg-zinc-700 dark:text-zinc-400 dark:hover:text-accent-foreground data-[state=open]:text-accent-foreground dark:data-[state=open]:text-accent-foreground data-[state=open]:bg-zinc-200 dark:data-[state=open]:bg-zinc-700"
        >
          <Filter className="size-4" />
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
        {tab.methods.map((method) => (
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
