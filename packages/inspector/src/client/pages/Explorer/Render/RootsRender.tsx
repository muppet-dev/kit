import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { eventHandler } from "@/client/lib/eventHandler";
import { useConnection } from "@/client/providers";
import { useRoots } from "@/client/providers/roots";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FolderTree, Info, Plus, Save, Trash } from "lucide-react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { ToolsTabs } from "./Tabs";

const schema = z.object({
  roots: z.array(
    z.object({
      uri: z.string(),
    }),
  ),
});

export function RootsRender() {
  const { sendNotification } = useConnection();
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { control, register, handleSubmit } = methods;
  const { fields, append, remove, replace } = useFieldArray({
    name: "roots",
    control,
  });
  const ref = useRoots();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      await sendNotification({ method: "notifications/roots/list_changed" });

      return values;
    },
    onSuccess: (values) => {
      ref.current = values.roots;

      toast.success("Roots updated successfully");
    },
    onError: (err) => {
      toast.error(err.message);

      console.error(err);
    },
  });

  const addRoots = eventHandler(() => append({ uri: "file://" }));
  const clearRoots = eventHandler(() => replace([]));
  const handleDeleteRootField = (index: number) =>
    eventHandler(() => remove(index));

  return (
    <div className="size-full flex flex-col gap-2">
      <ToolsTabs />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            (values) => mutation.mutateAsync(values),
            console.error,
          )}
          className="flex-1 pb-4 size-full flex flex-col gap-5 max-w-6xl mx-auto overflow-y-auto"
        >
          <div className="flex items-center gap-2">
            <FolderTree className="size-5" />
            <h2 className="text-2xl font-bold">Roots</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="size-max has-[>svg]:px-1 py-1"
                >
                  <Info className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Configure the root directories that the server can access
              </TooltipContent>
            </Tooltip>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <ClearButton onClick={clearRoots} />
              <Button
                colorScheme="secondary"
                onClick={addRoots}
                onKeyDown={addRoots}
              >
                <Plus />
                Add Root
              </Button>
              <SubmitButton />
            </div>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto size-full">
            {fields.length > 0 ? (
              fields.map(({ id }, index) => (
                <div key={id} className="flex items-center gap-2">
                  {`${index + 1}.`}
                  <Input
                    placeholder="file:// URI"
                    required
                    {...register(`roots.${index}.uri`)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteRootField(index)}
                    onKeyDown={handleDeleteRootField(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center rounded-md justify-center text-muted-foreground text-sm h-[200px] border">
                No roots configured. Add a root to start.
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

type ClearButton = {
  onClick: (event: React.BaseSyntheticEvent) => void;
};

function ClearButton({ onClick }: ClearButton) {
  const { control } = useFormContext();

  const value = useWatch({ control });

  return (
    <Button
      variant="ghost"
      disabled={!value.roots || value.roots?.length === 0}
      onClick={onClick}
      onKeyDown={onClick}
    >
      Clear All
    </Button>
  );
}

function SubmitButton() {
  const { control } = useFormContext();

  const value = useWatch({ control });

  return (
    <Button type="submit" disabled={!value.roots || value.roots?.length === 0}>
      <Save />
      Save
    </Button>
  );
}
