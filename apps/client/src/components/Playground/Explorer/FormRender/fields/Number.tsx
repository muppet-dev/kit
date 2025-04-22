import { useBlueprint, useDuckForm, useField } from "duck-form";
import { useId, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldType } from "./constants";
import { Input } from "@/components/ui/input";

export type NumberProps = {
  name?: string;
  type: FieldType.NUMBER;
  placeholder?: string;
  inputMode?: "none" | "numeric" | "decimal";
  min?: React.ComponentProps<"input">["min"];
  max?: React.ComponentProps<"input">["max"];
  defaultValue?: number;
  step?: number | "any";
};

export function NumberField() {
  const props = useField<NumberProps>();
  const { control } = useFormContext();
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
    <Controller
      name={componentId}
      control={control}
      render={({ field: { name, onChange, value, ref, disabled } }) => (
        <Input
          {...fieldProps}
          id={name}
          disabled={disabled}
          type="number"
          value={value}
          onChange={(event) => {
            const value = event.target.value;

            onChange?.(value !== "" ? Number(value) : undefined);
          }}
          ref={ref}
        />
      )}
    />
  );
}
