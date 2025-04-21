import { Blueprint, DuckField } from "duck-form";
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import { FieldWrapper } from "./fields/FieldWrapper";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type Form = {
  onSubmit: SubmitHandler<FieldValues>;
  schema: Record<string, unknown>;
  toolName: string;
};

export function Form(props: Form) {
  const methods = useForm();

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(props.onSubmit, console.error)}
        className="space-y-2"
      >
        <Blueprint wrapper={FieldWrapper} schema={props.schema}>
          {Object.entries(props.schema).map(([key, value]) => (
            <div
              key={key}
              className={cn(
                "flex w-full gap-1",
                // @ts-expect-error: type exists
                value.type === "boolean" ? "flex-row-reverse" : "flex-col"
              )}
            >
              <Label
                htmlFor={key}
                className={cn(
                  "text-secondary-800 dark:text-secondary-200 select-none text-sm font-medium leading-snug capitalize",
                  // @ts-expect-error: required exists
                  value.required &&
                    "after:ml-0.5 after:text-red-500 after:content-['*'] after:dark:text-red-400"
                )}
              >
                {key}
              </Label>
              <DuckField id={key} />
            </div>
          ))}
        </Blueprint>
        <Button type="submit" disabled={isSubmitting}>
          Run {props.toolName}
        </Button>
      </form>
    </FormProvider>
  );
}
