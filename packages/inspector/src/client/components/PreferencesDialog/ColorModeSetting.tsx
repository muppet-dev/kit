import { eventHandler } from "@/client/lib/eventHandler";
import { Theme, usePreferences } from "@/client/providers";
import { Moon, Sun, Tv } from "lucide-react";
import { Label } from "../ui/label";
import { ItemCard } from "./ItemCard";

const THEMES = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: Moon,
  [Theme.SYSTEM]: Tv,
};

export function ColorModeSetting() {
  const { theme, setTheme } = usePreferences();

  const handleChangeColorMode = (name: Theme) =>
    eventHandler(() => setTheme(name));

  return (
    <div className="flex flex-col gap-2">
      <Label>Color Mode</Label>
      <div className="flex items-center w-full gap-2">
        {Object.entries(THEMES).map(([name, icon]) => {
          const isSelected = theme === name;

          return (
            <ItemCard
              key={name}
              name={name}
              icon={icon}
              isSelected={isSelected}
              onClick={handleChangeColorMode(name as Theme)}
              onKeyDown={handleChangeColorMode(name as Theme)}
              className="capitalize"
            />
          );
        })}
      </div>
    </div>
  );
}
