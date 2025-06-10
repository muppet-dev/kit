import { eventHandler } from "@/client/lib/eventHandler";
import { usePreferences } from "@/client/providers";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../ui/button";

export function DeleteThemeButton(props: { name: string }) {
  const { setColorTheme, setCurrentColorTheme, currentColorTheme } =
    usePreferences();

  const mutation = useMutation({
    mutationFn: async () => {
      setColorTheme((prev) => {
        const newThemes = { ...prev };
        delete newThemes[props.name];
        return newThemes;
      });
    },
    onSuccess: () => {
      toast.success(`${props.name} theme deleted successfully`);
      if (currentColorTheme === props.name) {
        setCurrentColorTheme("default");
      }
    },
    onError: () => {
      toast.error(`Error deleting ${props.name} theme`);
    },
  });

  const handleDeleteTheme = eventHandler(() => mutation.mutateAsync());

  return (
    <Button
      title="Delete Theme"
      colorScheme="destructive"
      variant="ghost"
      className="size-max has-[>svg]:px-1 py-1"
      onClick={handleDeleteTheme}
      onKeyDown={handleDeleteTheme}
    >
      <Trash className="size-3.5" />
    </Button>
  );
}
