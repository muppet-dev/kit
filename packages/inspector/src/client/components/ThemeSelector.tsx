import { useLocalStorage } from "@uidotdev/usehooks";
import { Moon, Sun, Tv } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import { cn } from "../lib/utils";
import { Theme, useTheme } from "../providers";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const THEMES = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: Moon,
  [Theme.SYSTEM]: Tv,
};

export function ThemeSelector() {
  const { themeStorageKey, setTheme } = useTheme();
  const [theme] = useLocalStorage(themeStorageKey);
  const { state } = useSidebar();

  const ThemeTriggerIcon = THEMES[theme as keyof typeof THEMES];

  const handleChangeTheme = (theme: Theme) => (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="size-8 data-[state=open]:bg-accent"
              >
                <ThemeTriggerIcon className="size-4 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent side={state === "collapsed" ? "right" : "top"}>
          Change Theme
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" side="right" className="space-y-1 z-10">
        {Object.entries(THEMES).map(([name, Icon]) => {
          const isSelected = theme === name;

          return (
            <DropdownMenuItem
              key={name}
              className={cn(
                isSelected && "bg-secondary focus:bg-secondary",
                "capitalize group"
              )}
              onClick={handleChangeTheme(name as Theme)}
              onKeyDown={handleChangeTheme(name as Theme)}
            >
              <Icon
                className={cn(
                  isSelected && "text-black dark:text-white",
                  "stroke-2 size-4"
                )}
              />
              {name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
