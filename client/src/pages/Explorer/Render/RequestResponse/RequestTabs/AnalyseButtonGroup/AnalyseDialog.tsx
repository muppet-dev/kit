import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMCPItem } from "../../../../providers";
import { AnalyseButton } from "./AnalyseButton";
import { useAnalyse } from "./provider";

const schema = z.object({
  context: z.string(),
});

export type AnalyseDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AnalyseDialog({ onOpenChange, open }: AnalyseDialog) {
  const { selectedItem } = useMCPItem();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useAnalyse();

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
          className="w-full space-y-2"
        >
          <Textarea {...register("context")} required />
          <p className="text-sm text-red-500 dark:text-red-300 empty:hidden">
            {errors.context?.message}
          </p>
          <div className="flex items-center justify-end">
            <AnalyseButton type="submit" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
