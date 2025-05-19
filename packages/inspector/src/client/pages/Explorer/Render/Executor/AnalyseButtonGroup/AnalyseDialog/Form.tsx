import { Button } from "../../../../../../components/ui/button";
import { Label } from "../../../../../../components/ui/label";
import { Textarea } from "../../../../../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useMCPItem } from "../../../../providers";
import { useAnalyse } from "../provider";
import { useConfig } from "../../../../../../providers";
import { ModelField } from "../../../../../../components/ModelField";
import { Spinner } from "../../../../../../components/ui/spinner";

const schema = z.object({
  context: z.string(),
  model: z.string().optional(),
});

export type AnalyseForm = {
  onSubmit: () => void;
};

export function AnalyseForm(props: AnalyseForm) {
  const { selectedItem } = useMCPItem();
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
          <p className="text-sm text-red-500 dark:text-red-300">
            {errors.model?.message}
          </p>
        )}
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? "Analysing" : "Analyse"}
        </Button>
      </div>
    </form>
  );
}
