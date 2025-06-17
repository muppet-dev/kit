import { useBlueprint, useDuckForm, useField } from "@/client/providers";
import { useId, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import type { FieldType } from "./constants";

export type CheckboxProps = {
  name?: string;
  type: FieldType.BOOLEAN;
  defaultValue?: boolean;
};

export function CheckboxField() {
  const props = useField<CheckboxProps>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();
  const { control } = useFormContext();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const componentId = customId ?? autoId;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...fieldProps } = props;

  return (
    <Controller
      name={componentId}
      control={control}
      render={({ field: { name, onChange, ref, value } }) => (
        <Checkbox
          id={name}
          name={fieldProps.name}
          defaultChecked={fieldProps.defaultValue}
          checked={value}
          onCheckedChange={onChange}
          ref={ref}
        />
      )}
    />
  );
}
