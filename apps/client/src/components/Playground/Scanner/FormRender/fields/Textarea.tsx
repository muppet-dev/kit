import { useBlueprint, useDuckForm, useField } from "duck-form";
import { useId, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldType } from "./constants";
import { Textarea } from "@/components/ui/textarea";

export type TextareaProps = {
  name?: string;
  type: FieldType.TEXTAREA;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  minLength?: number;
};

export function TextareaField() {
  const props = useField<TextareaProps>();
  const { register } = useFormContext();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props]
  );

  const componentId = customId ?? autoId;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...fieldProps } = props;

  return <Textarea {...fieldProps} {...register(componentId)} />;
}
