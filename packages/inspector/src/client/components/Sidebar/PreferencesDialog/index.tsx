import { usePreferences } from "@/client/providers/preferences";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { ColorModeSetting } from "./ColorModeSetting";
import { ThemeDialog } from "./ThemeDialog";
import { ThemeSettings } from "./ThemeSettings";
import { ToastSetting } from "./ToastSetting";

export type DialogType =
  | {
      type: "add";
    }
  | {
      type: "edit";
      data?: Record<string, string>;
    };

export function PreferencesDialog() {
  const { colorTheme } = usePreferences();
  const [isThemeDialog, setThemeDialog] = useState<DialogType | undefined>();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setOpen}>
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
          <ColorModeSetting />
          <ThemeSettings
            onAddDialogOpen={() =>
              setThemeDialog({
                type: "add",
              })
            }
            onEditDialogOpen={(name) =>
              setThemeDialog({
                type: "edit",
                data: {
                  name,
                  variables: colorTheme[name],
                },
              })
            }
          />
          <ToastSetting />
        </DialogContent>
      </Dialog>
      <ThemeDialog
        open={Boolean(isThemeDialog)}
        onOpenChange={(open) => {
          if (!open) setThemeDialog(undefined);
        }}
        defaultValues={
          isThemeDialog?.type === "edit" ? isThemeDialog?.data : undefined
        }
      />
    </>
  );
}
