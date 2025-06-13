import {
  EllipsisVertical,
  ListX,
  MoveDown,
  MoveUp,
  Settings,
} from "lucide-react";
import { type BaseSyntheticEvent, useState } from "react";
import { SortingEnum } from "../../../../lib/utils";
import { useConfig, usePreferences } from "../../../../providers";
import { PreferencesDialog } from "../../../PreferencesDialog";
import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";

export function ConfigurationsMenu() {
  const { toggleConfigurationsSort, configurationsSort } = usePreferences();
  const { clearAllConfigurations, localSavedConfigs } = useConfig();
  const [isOpenPreferenceDialog, setOpenPreferenceDialog] = useState(false);

  const handleToggleConfigurations = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    toggleConfigurationsSort();
  };
  const handleAllDelete = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    clearAllConfigurations();
  };
  const handleOpenPreferenceDialog = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    setOpenPreferenceDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-max has-[>svg]:px-1 px-1 py-1 data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground rounded-sm"
          >
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem
            onClick={handleOpenPreferenceDialog}
            onKeyDown={handleOpenPreferenceDialog}
          >
            <Settings />
            Preferences
          </DropdownMenuItem>
          {localSavedConfigs != null && localSavedConfigs.length !== 0 && (
            <>
              <DropdownMenuItem
                onClick={handleToggleConfigurations}
                onKeyDown={handleToggleConfigurations}
              >
                {configurationsSort === SortingEnum.ASCENDING && (
                  <MoveUp className="size-3.5" />
                )}
                {configurationsSort === SortingEnum.DESCENDING && (
                  <MoveDown className="size-3.5" />
                )}
                Sort Configurations
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleAllDelete}
                onKeyDown={handleAllDelete}
                variant="destructive"
              >
                <ListX />
                Clear Configurations
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <PreferencesDialog
        open={isOpenPreferenceDialog}
        onOpenChange={setOpenPreferenceDialog}
      />
    </>
  );
}
