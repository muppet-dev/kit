import { eventHandler } from "@/client/lib/eventHandler";
import { useBlueprint, useDuckForm, useField } from "@/client/providers";
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";
import { useId, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DuckField } from "../DuckField";
import { Button } from "../ui/button";
import type { FieldType } from "./constants";
import type { FieldProps } from "./types";

export type ArrayProps = {
  type: FieldType.ARRAY;
  items: FieldProps;
};

export function ArrayField() {
  const props = useField<ArrayProps>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const componentId = customId ?? autoId;

  const { control } = useFormContext();
  const { fields, append, swap, remove, insert } = useFieldArray({
    control,
    name: componentId,
  });

  const handleAddItem = eventHandler(() => append(undefined));
  const handleGoUp = (index: number) =>
    eventHandler(() => swap(index, index - 1));
  const handleGoDown = (index: number) =>
    eventHandler(() => swap(index, index + 1));
  const handleInsertNew = (index: number) =>
    eventHandler(() => insert(index + 1, undefined));
  const handleDelete = (index: number) => eventHandler(() => remove(index));

  return (
    <>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex mb-2 min-h-[120px] items-center gap-2 rounded-lg border p-2"
        >
          <div className="space-y-2">
            <Button
              title="Go Up"
              variant="ghost"
              onClick={handleGoUp(index)}
              onKeyDown={handleGoUp(index)}
              disabled={index === 0}
              className="size-max has-[>svg]:px-1.5 py-1.5"
            >
              <ArrowUp className="stroke-2" />
            </Button>
            <Button
              title="Go Down"
              variant="ghost"
              onClick={handleGoDown(index)}
              onKeyDown={handleGoDown(index)}
              disabled={index === fields.length - 1}
              className="size-max has-[>svg]:px-1.5 py-1.5"
            >
              <ArrowDown className="stroke-2" />
            </Button>
          </div>
          <DuckField id={`${componentId}.${index}`} {...props.items} />
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={handleInsertNew(index)}
              onKeyDown={handleInsertNew(index)}
              className="size-max has-[>svg]:px-1.5 py-1.5"
            >
              <Plus className="stroke-2" />
            </Button>
            <Button
              colorScheme="destructive"
              variant="ghost"
              onClick={handleDelete(index)}
              onKeyDown={handleDelete(index)}
              className="size-max has-[>svg]:px-1.5 py-1.5"
            >
              <Trash className="stroke-2" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={handleAddItem}
        onKeyDown={handleAddItem}
        className="w-max"
      >
        Add
      </Button>
    </>
  );
}
