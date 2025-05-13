import { Button } from "@/client/components/ui/button";
import { Label } from "@/client/components/ui/label";
import { Textarea } from "@/client/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useMCPItem } from "../../../../providers";
import { useAnalyse } from "../provider";

const schema = z.object({
  context: z.string(),
});

export type AnalyseForm = {
  onSubmit: () => void;
};

export function AnalyseForm(props: AnalyseForm) {
  const { selectedItem } = useMCPItem();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const mutation = useAnalyse();

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await mutation.mutateAsync({
          ...selectedItem!,
          context: values.context,
        });

        reset();
        props.onSubmit();
      }, console.error)}
      className="w-full space-y-4"
    >
      <div>
        <Label>Additional Context</Label>
        <p className="text-xs text-muted-foreground mb-1">
          Add background information or specific conditions to customize the
          analysis results.
        </p>
        <Textarea {...register("context")} required />
        {errors.context && (
          <p className="text-sm text-red-500 dark:text-red-300">
            {errors.context.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit">Analyse</Button>
      </div>
    </form>
  );
}
