import { ModelField } from "@/client/components/ModelField";
import { Button } from "@/client/components/ui/button";
import { Label } from "@/client/components/ui/label";
import { Spinner } from "@/client/components/ui/spinner";
import { Textarea } from "@/client/components/ui/textarea";
import { useConfig } from "@/client/providers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useGenerate } from "../provider";

const schema = z.object({
  context: z.string().optional(),
  model: z.string().optional(),
});

export type GenerateForm = {
  onSubmit: () => void;
};

export function GenerateForm(props: GenerateForm) {
  const { getDefaultModel } = useConfig();
  const model = getDefaultModel();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      model,
    },
  });

  const mutation = useGenerate();

  const isFormSubmitting = isSubmitting || mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await mutation.mutateAsync({
          context: values.context,
          modelId: values.model,
        });

        reset();
        props.onSubmit();
      }, console.error)}
      className="w-full space-y-4"
    >
      <div>
        <Label htmlFor="context">Additional Context</Label>
        <p className="text-xs text-muted-foreground mb-1">
          Add background information or specific conditions to customize the
          generated sample data.
        </p>
        <Textarea id="context" {...register("context")} />
        {errors.context && (
          <p className="text-sm text-destructive">{errors.context.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label>Model</Label>
        <Controller
          name="model"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ModelField value={value} onChange={onChange} className="w-full" />
          )}
        />
        {errors.model && (
          <p className="text-sm text-destructive">{errors.model?.message}</p>
        )}
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isFormSubmitting}>
          {isFormSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
          {isFormSubmitting ? "Generating" : "Generate"}
        </Button>
      </div>
    </form>
  );
}
