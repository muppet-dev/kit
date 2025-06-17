import { usePreferences } from "@/client/providers/preferences";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ColorModeSetting } from "./ColorModeSetting";
import { ThemeDialog } from "./ThemeDialog";
import { ThemeSettings } from "./ThemeSettings";
import { ToastSetting } from "./ToastSetting";
import { useHotkeys } from "react-hotkeys-hook";

export type DialogType =
  | {
      type: "add";
    }
  | {
      type: "edit";
      data?: Record<string, string>;
    };

export type PreferencesDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PreferencesDialog(props: PreferencesDialog) {
  const { colorTheme } = usePreferences();
  const [isThemeDialog, setThemeDialog] = useState<DialogType | undefined>();

  useHotkeys("shift+p", () => props.onOpenChange(!props.open), {
    description: "Open Preferences Dialog",
  });

  return (
    <>
      <Dialog {...props}>
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
