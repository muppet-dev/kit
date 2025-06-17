import { useBlueprint, useDuckForm, useField } from "@/client/providers";
import { useId, useMemo } from "react";
import { DuckField } from "../DuckField";
import type { FieldType } from "./constants";
import type { FieldProps } from "./types";

export interface ObjectProps<
  T extends Record<string, FieldProps> = Record<string, FieldProps>,
> {
  type: FieldType.OBJECT;
  properties: T;
}

export function ObjectField<
  T extends Record<string, FieldProps> = Record<string, FieldProps>,
>() {
  // @ts-expect-error: <explaination
  const props = useField() as ObjectProps<T>;
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    // @ts-expect-error: <explaination>
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const componentId = customId ?? autoId;

  return (
    <div className="p-1 md:p-2 lg:p-3 xl:p-4 border flex flex-col rounded-md gap-1 md:gap-2 lg:gap-3 xl:gap-4">
      {Object.entries(props.properties).map(([fieldName, field]) => {
        const uniqueName = `${componentId}.${fieldName}`;

        return (
          <DuckField
            key={uniqueName}
            {...field}
            id={uniqueName}
            name={uniqueName}
          />
        );
      })}
    </div>
  );
}
