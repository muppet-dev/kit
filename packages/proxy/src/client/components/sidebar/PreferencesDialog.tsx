import { Theme, usePreferences } from "@/client/providers";
import { eventHandler } from "@/client/lib/eventHandler";
import { cn } from "@/client/lib/utils";
import { type LucideIcon, Moon, Settings, Sun, Tv } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import toast, { type ToastPosition } from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const THEMES = {
  [Theme.LIGHT]: Sun,
  [Theme.DARK]: Moon,
  [Theme.SYSTEM]: Tv,
};

const TOAST_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function PreferencesDialog() {
  const { toastPosition, setToast, setTheme, theme } = usePreferences();

  const handleChangeTheme = (name: Theme) => eventHandler(() => setTheme(name));

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DialogTrigger asChild>
              <Button variant="ghost" className="size-8">
                <Settings />
              </Button>
            </DialogTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>Preferences</TooltipContent>
      </Tooltip>
      <DialogContent className="gap-5">
        <DialogHeader className="gap-1">
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Change the theme and toast position of the application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label>Theme</Label>
          <div className="flex items-center w-full gap-2">
            {Object.entries(THEMES).map(([name, icon]) => {
              const isSelected = theme === name;

              return (
                <ItemCard
                  key={name}
                  isSelected={isSelected}
                  onClick={handleChangeTheme(name as Theme)}
                  name={name}
                  icon={icon}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Toast Position</Label>
          <div className="grid grid-cols-3 gap-3">
            {TOAST_POSITIONS.map((name) => {
              const isSelected = toastPosition === name;

              return (
                <ItemCard
                  key={name}
                  isSelected={isSelected}
                  onClick={() => {
                    setToast(name as ToastPosition);

                    toast.success(`Toast position changed to ${name}`, {
                      id: "toast-position-changed",
                    });
                  }}
                  name={name}
                />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type ItemCard = {
  isSelected: boolean;
  onClick: (event: BaseSyntheticEvent) => void;
  icon?: LucideIcon;
  name: string;
};

function ItemCard({ isSelected, name, onClick, icon: Icon }: ItemCard) {
  return (
    <div
      className={cn(
        "px-4 py-[8px] border text-muted-foreground leading-none cursor-pointer hover:bg-accent/60 hover:border-primary/30 transition-all ease-in-out capitalize flex items-center gap-2 w-full justify-center",
        isSelected && "bg-accent/60 border-primary/30 text-foreground"
      )}
      onClick={onClick}
      onKeyDown={onClick}
    >
      {Icon && <Icon className="stroke-2 size-4" />}
      {name}
    </div>
  );
}
