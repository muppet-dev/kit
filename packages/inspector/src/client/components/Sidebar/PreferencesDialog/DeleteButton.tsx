import { eventHandler } from "@/client/lib/eventHandler";
import { usePreferences } from "@/client/providers";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../ui/button";

export function DeleteButton({ name }: { name: string }) {
  const { setColorTheme } = usePreferences();

  const mutation = useMutation({
    mutationFn: async () => {
      setColorTheme((prev) => {
        const newThemes = { ...prev };
        delete newThemes[name];
        return newThemes;
      });
    },
    onSuccess: () => {
      toast.success("Theme deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete theme");
    },
  });

  const handleDeleteTheme = eventHandler(() => mutation.mutateAsync());

  return (
    <Button
      colorScheme="destructive"
      variant="ghost"
      className="size-max has-[>svg]:px-1 py-1"
      onClick={handleDeleteTheme}
      onKeyDown={handleDeleteTheme}
      title="Delete Theme"
    >
      <Trash className="size-3.5" />
    </Button>
  );
}
