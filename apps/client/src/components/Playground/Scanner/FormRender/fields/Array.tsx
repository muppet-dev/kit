import { DuckField, useBlueprint, useDuckForm, useField } from "duck-form";
import { useId, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { FieldType } from "./constants";
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";
import type { FieldProps } from "./types";
import { Button } from "@/components/ui/button";

export type ArrayProps = {
  type: FieldType.ARRAY;
  of: FieldProps;
  defaultValue?: unknown[] | (() => unknown[]);
  options?: {
    sortable?: boolean;
    layout?: "tags" | "grid";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list?: { title: string; value: any }[];
    editModal?: "dialog" | "fullscreen" | "popover";
  };
};

export function ArrayField() {
  const props = useField<ArrayProps>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props]
  );

  const componentId = customId ?? autoId;

  const { control } = useFormContext();
  const { fields, append, swap, remove, insert } = useFieldArray({
    control,
    name: componentId,
  });

  const handleAddItem = () => append(undefined);
  const handleGoUp = (index: number) => () => swap(index, index - 1);
  const handleGoDown = (index: number) => () => swap(index, index + 1);
  const handleInsertNew = (index: number) => () => insert(index + 1, undefined);
  const handleDelete = (index: number) => () => remove(index);

  return (
    <>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex mb-2 min-h-[120px] items-center gap-2 rounded-lg border border-secondary-200 p-2 dark:border-secondary-800"
        >
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoUp(index)}
              onKeyDown={handleGoUp(index)}
              disabled={index === 0}
            >
              <ArrowUp className="size-4 stroke-2" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoDown(index)}
              onKeyDown={handleGoDown(index)}
              disabled={index === fields.length - 1}
            >
              <ArrowDown className="size-4 stroke-2" />
            </Button>
          </div>
          <DuckField id={`${componentId}.${index}`} {...props.of} />
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleInsertNew(index)}
              onKeyDown={handleInsertNew(index)}
            >
              <Plus className="size-4 stroke-2" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete(index)}
              onKeyDown={handleDelete(index)}
            >
              <Trash className="size-4 stroke-2" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        onClick={handleAddItem}
        onKeyDown={handleAddItem}
        className="w-max"
      >
        Add
      </Button>
    </>
  );
}
