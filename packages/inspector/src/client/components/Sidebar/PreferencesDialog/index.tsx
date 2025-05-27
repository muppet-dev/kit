import { eventHandler } from "@/client/lib/eventHandler";
import { Theme, usePreferences } from "@/client/providers/preferences";
import { Moon, Pencil, Plus, Settings, Sun, Tv } from "lucide-react";
import { useState } from "react";
import toast, { type ToastPosition } from "react-hot-toast";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { DeleteButton } from "./DeleteButton";
import { ItemCard } from "./ItemCard";
import { ThemeDialog } from "./ThemeDialog";

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

export type DialogType =
  | {
      type: "add";
    }
  | {
      type: "edit";
      data?: Record<string, string>;
    };

export function PreferencesDialog() {
  const {
    toastPosition,
    setToast,
    setTheme,
    theme,
    currentColorTheme,
    colorTheme,
    setCurrentColorTheme,
  } = usePreferences();
  const [isOpen, setOpen] = useState<DialogType>();

  const handleChangeColorMode = (name: Theme) =>
    eventHandler(() => setTheme(name));

  const handleChangeTheme = (name: string) =>
    eventHandler(() => setCurrentColorTheme(name));

  const handleOpenThemeDialog = eventHandler(() =>
    setOpen({
      type: "add",
    })
  );

  const handleEditTheme = (name: string) =>
    eventHandler(() =>
      setOpen({
        type: "edit",
        data: {
          name,
          variables: colorTheme[name],
        },
      })
    );

  return (
    <>
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
            <Label>Color Mode</Label>
            <div className="flex items-center w-full gap-2">
              {Object.entries(THEMES).map(([name, icon]) => {
                const isSelected = theme === name;

                return (
                  <ItemCard
                    key={name}
                    isSelected={isSelected}
                    onClick={handleChangeColorMode(name as Theme)}
                    name={name}
                    className="capitalize"
                    icon={icon}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Theme</Label>
            <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto">
              {Object.keys(colorTheme).map((name) => {
                const isSelected = currentColorTheme === name;

                return (
                  <ItemCard
                    key={name}
                    isSelected={isSelected}
                    onClick={handleChangeTheme(name)}
                    name={name}
                    className="justify-start"
                  >
                    {name !== "default" && (
                      <>
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          className="size-max has-[>svg]:px-1 py-1"
                          onClick={handleEditTheme(name)}
                          onKeyDown={handleEditTheme(name)}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <DeleteButton name={name} />
                      </>
                    )}
                  </ItemCard>
                );
              })}
              <ItemCard
                isSelected={false}
                onClick={handleOpenThemeDialog}
                name="Add Theme"
                className="h-10"
                icon={Plus}
              />
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
                    className="capitalize"
                    name={name}
                  />
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ThemeDialog onOpenChange={setOpen} open={isOpen} />
    </>
  );
}
