import { ModelField } from "@/client/components/ModelField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Label } from "@/client/components/ui/label";
import { Textarea } from "@/client/components/ui/textarea";
import { useConfig } from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useMCPItem } from "../../../providers";
import { GenerateButton } from "./GenerateButton";
import { useGenerate } from "./provider";

const schema = z.object({
  context: z.string(),
  model: z.string().optional(),
});

export type GenerateDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GenerateDialog({ onOpenChange, open }: GenerateDialog) {
  const { selectedItem } = useMCPItem();
  const { getDefaultModel } = useConfig();
  const model = getDefaultModel();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      model,
    },
  });

  const mutation = useGenerate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (values) => {
            await mutation.mutateAsync({
              ...selectedItem!,
              context: values.context,
              modelId: values.model,
            });

            reset();
            onOpenChange(false);
          }, console.error)}
          className="w-full space-y-4"
        >
          <div className="space-y-1">
            <Label>Additional Context</Label>
            <p className="text-xs text-muted-foreground">
              Add background information or specific conditions to customize the
              generated sample data.
            </p>
            <Textarea {...register("context")} required />
            {errors.context && (
              <p className="text-sm text-red-500 dark:text-red-300">
                {errors.context.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Model</Label>
            <Controller
              name="model"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ModelField
                  value={value}
                  onChange={onChange}
                  className="w-full"
                />
              )}
            />
            {errors.model && (
              <p className="text-sm text-red-500 dark:text-red-300">
                {errors.model?.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end">
            <GenerateButton type="submit" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
