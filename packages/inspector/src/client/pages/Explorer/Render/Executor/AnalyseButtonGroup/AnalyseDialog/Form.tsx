import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { ModelField } from "../../../../../../components/ModelField";
import { Button } from "../../../../../../components/ui/button";
import { Label } from "../../../../../../components/ui/label";
import { Spinner } from "../../../../../../components/ui/spinner";
import { Textarea } from "../../../../../../components/ui/textarea";
import { useConfig } from "../../../../../../providers";
import { useAnalyse } from "../useAnalyse";

const schema = z.object({
  context: z.string().optional(),
  model: z.string().optional(),
});

export type AnalyseForm = {
  onSubmit: () => void;
};

export function AnalyseForm(props: AnalyseForm) {
  const { getDefaultModel } = useConfig();
  const model = getDefaultModel();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
    watch,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      model,
    },
  });

  const values = watch();
  const { refetch } = useAnalyse(values);

  return (
    <form
      onSubmit={handleSubmit(async () => {
        await refetch();

        reset();
        props.onSubmit();
      }, console.error)}
      className="w-full space-y-4"
    >
      <div>
        <Label htmlFor="context">Additional Context</Label>
        <p className="text-xs text-muted-foreground mb-1">
          Add background information or specific conditions to customize the
          analysis results.
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
          {isSubmitting ? "Analysing" : "Analyse"}
        </Button>
      </div>
    </form>
  );
}
