import { Button } from "@/client/components/ui/button";
import { eventHandler } from "@/client/lib/eventHandler";
import { serversDataQueryKey } from "@/client/queries/useServersData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

export function DeleteButton({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () =>
      await fetch(`/api/servers/${id}`, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete server");
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: serversDataQueryKey,
      });

      toast.success("Server deleted successfully");
    },
    onError: (err) => {
      console.error(err);

      toast.error(err.message);
    },
  });

  const handleDelete = eventHandler(() => mutation.mutateAsync());

  return (
    <Button
      title="Delete item"
      variant="ghost"
      colorScheme="destructive"
      className="size-max has-[>svg]:px-1.5 py-1.5"
      onClick={handleDelete}
      onKeyDown={handleDelete}
    >
      <Trash />
    </Button>
  );
}
