import { cn } from "@/lib/utils";
import { type Theme, useTheme } from "@/providers";
import { MoonIcon, SunIcon, TvIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const THEMES = {
  light: SunIcon,
  dark: MoonIcon,
  system: TvIcon,
};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const ThemeTriggerIcon = THEMES[theme as keyof typeof THEMES];

  const handler = (name: Theme) => () => setTheme(name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 data-[state=open]:bg-accent">
          <ThemeTriggerIcon className="size-4 stroke-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="space-y-1 z-10">
        {Object.entries(THEMES).map(([name, Icon]) => {
          const isSelected = theme === name;

          return (
            <DropdownMenuItem
              key={name}
              className={cn(
                isSelected && "bg-secondary focus:bg-secondary",
                "capitalize group",
              )}
              onClick={handler(name as Theme)}
              onKeyDown={handler(name as Theme)}
            >
              <Icon
                className={cn(
                  isSelected && "text-black dark:text-white",
                  "stroke-2 size-4",
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
