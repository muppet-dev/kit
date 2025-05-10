import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { Textarea } from "@/client/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMCPItem } from "../../../providers";
import { GenerateButton } from "./GenerateButton";
import { useGenerate } from "./provider";

const schema = z.object({
  context: z.string(),
});

export type GenerateDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GenerateDialog({ onOpenChange, open }: GenerateDialog) {
  const { selectedItem } = useMCPItem();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useGenerate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Additional Context</DialogTitle>
          <DialogDescription>
            Add background information or specific conditions to customize the
            generated sample data.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (values) => {
            await mutation.mutateAsync({
              ...selectedItem!,
              context: values.context,
            });

            reset();
            onOpenChange(false);
          }, console.error)}
          className="w-full space-y-4"
        >
          <Textarea {...register("context")} required />
          <p className="text-sm text-red-500 dark:text-red-300 empty:hidden">
            {errors.context?.message}
          </p>
          <div className="flex items-center justify-end">
            <GenerateButton type="submit" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
