import { useBlueprint, useDuckForm, useField } from "@/client/providers";
import { useId, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import type { FieldType } from "./constants";

export type TextareaProps = {
  name?: string;
  type: FieldType.STRING;
  placeholder?: string;
  defaultValue?: string;
};

export function TextareaField() {
  const props = useField<TextareaProps>();
  const { register } = useFormContext();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const componentId = customId ?? autoId;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...fieldProps } = props;

  return <Textarea {...fieldProps} {...register(componentId)} />;
}
