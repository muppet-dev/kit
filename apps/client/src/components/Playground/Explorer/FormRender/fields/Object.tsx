import { DuckField, useBlueprint, useDuckForm, useField } from "duck-form";
import { useId, useMemo } from "react";
import type { FieldType } from "./constants";
import type { FieldProps } from "./types";

export type Promisify<T> = T | Promise<T>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

export type DefaultValue<T extends Record<string, FieldProps>> = {
  [K in keyof T]?: T[K] extends { blocks: Record<string, FieldProps> }
    ? ObjectProps<T[K]["blocks"]>["defaultValue"]
    : // @ts-expect-error: <explaination>
      FieldPropsMap[T[K]["type"]]["defaultValue"];
};

export interface ObjectProps<
  T extends Record<string, FieldProps> = Record<string, FieldProps>
> {
  type: FieldType.OBJECT;
  properties: T;
  defaultValue?: Prettify<DefaultValue<T>>;
  fieldsets?: { name: string; label: string }[];
  options?: {
    collapsible?: boolean;
    collapsed?: boolean;
    columns?: number;
  };
}

export function ObjectField<
  T extends Record<string, FieldProps> = Record<string, FieldProps>
>() {
  // @ts-expect-error: <explaination>
  const props = useField() as ObjectProps<T>;
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    // @ts-expect-error: <explaination>
    () => generateId?.(schema, props),
    [generateId, schema, props]
  );

  const componentId = customId ?? autoId;

  return (
    <div className="p-3 md:p-4 lg:p-5 xl:p-6 border flex flex-col border-secondary-200 dark:border-secondary-800 rounded-md gap-3 md:gap-4 lg:gap-5 xl:gap-6">
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
