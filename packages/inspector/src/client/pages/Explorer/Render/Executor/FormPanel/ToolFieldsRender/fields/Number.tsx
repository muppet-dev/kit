import { Input } from "../../../../../../../components/ui/input";
import {
  useBlueprint,
  useDuckForm,
  useField,
} from "../../../../../../../providers";
import { useId, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldType } from "./constants";

export type NumberProps = {
  name?: string;
  type: FieldType.NUMBER;
  placeholder?: string;
  defaultValue?: number;
};

export function NumberField() {
  const props = useField<NumberProps>();
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

  return (
    <Input
      {...fieldProps}
      type="number"
      {...register(componentId, { valueAsNumber: true })}
    />
  );
}
