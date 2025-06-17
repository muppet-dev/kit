import { eventHandler } from "@/client/lib/eventHandler";
import { usePreferences } from "@/client/providers";
import { Pencil, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { ItemCard } from "../ItemCard";
import { DeleteThemeButton } from "./DeleteButton";

export type ThemeSettings = {
  onEditDialogOpen: (name: string) => void;
  onAddDialogOpen: () => void;
};

export function ThemeSettings(props: ThemeSettings) {
  const { colorTheme, currentColorTheme, setCurrentColorTheme } =
    usePreferences();

  const handleChangeTheme = (name: string) =>
    eventHandler(() => setCurrentColorTheme(name));

  const handleOpenEditThemeDialog = (name: string) =>
    eventHandler(() => props.onEditDialogOpen?.(name));

  const handleOpenAddThemeDialog = eventHandler(() =>
    props.onAddDialogOpen?.(),
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>Theme</Label>
      <div className="flex flex-col gap-1.5 overflow-y-auto">
        <div className="flex flex-col gap-1.5 max-h-[210px] overflow-y-auto">
          {Object.keys(colorTheme).map((name) => {
            const isSelected = currentColorTheme === name;

            return (
              <ItemCard
                key={name}
                isSelected={isSelected}
                onClick={handleChangeTheme(name)}
                name={name}
                className="justify-start text-foreground px-2 pl-3 text-sm"
              >
                {name !== "default" && (
                  <>
                    <div className="flex-1" />
                    <Button
                      title="Edit Theme"
                      variant="ghost"
                      className="size-max has-[>svg]:px-1 py-1"
                      onClick={handleOpenEditThemeDialog(name)}
                      onKeyDown={handleOpenEditThemeDialog(name)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <DeleteThemeButton name={name} />
                  </>
                )}
              </ItemCard>
            );
          })}
        </div>
        <ItemCard
          name="Add Theme"
          icon={Plus}
          isSelected={false}
          onClick={handleOpenAddThemeDialog}
          onKeyDown={handleOpenAddThemeDialog}
          className="h-10 text-foreground text-sm gap-1"
        />
      </div>
    </div>
  );
}
