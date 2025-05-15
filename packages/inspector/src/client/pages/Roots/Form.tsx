import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConnection } from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, Save, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const schema = z.object({
  roots: z.array(z.string()),
});

export function RootsForm() {
  const { sendNotification } = useConnection();

  const { control, register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { roots: [] },
  });

  const { fields, append, remove } = useFieldArray({
    // @ts-expect-error
    name: "roots",
    control,
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) =>
      await sendNotification({ method: "notifications/roots/list_changed" }),
    onError: (err) => {
      toast.error(err.message);

      console.error(err);
    },
  });

  const addRoots = eventHandler(() => append(undefined));
  const handleDeleteField = (index: number) =>
    eventHandler(() => remove(index));

  return (
    <form
      onSubmit={handleSubmit(
        (values) => mutation.mutateAsync(values),
        console.error
      )}
      className="space-y-4 flex-1 overflow-y-auto"
    >
      {fields.map(({ id }, index) => (
        <div key={id} className="flex items-center gap-2">
          {`${index + 1}.`}
          <Input
            placeholder="Enter URL"
            required
            {...register(`roots.${index}`)}
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteField(index)}
            onKeyDown={handleDeleteField(index)}
          >
            <Trash />
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={addRoots} onKeyDown={addRoots}>
          <Plus />
          Add Root
        </Button>
        {fields.length > 0 && (
          <Button type="submit">
            <Save />
            Save
          </Button>
        )}
      </div>
    </form>
  );
}
