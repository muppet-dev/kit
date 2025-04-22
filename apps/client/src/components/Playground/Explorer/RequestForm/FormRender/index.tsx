import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Blueprint, DuckField, DuckForm } from "duck-form";
import type { JSONSchema7 } from "json-schema";
import { quackFields } from "./fields";
import { FieldWrapper } from "./fields/FieldWrapper";

export type FormRender = {
  schema?: JSONSchema7["properties"] | JSONSchema7[];
};

export function FormRender(props: FormRender) {
  if (!props.schema) return <></>;

  const schema = Array.isArray(props.schema)
    ? props.schema.reduce((prev, cur) => {
        prev[cur.name] = cur;
        return prev;
      }, {})
    : props.schema;

  return (
    <DuckForm
      components={quackFields}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <Blueprint wrapper={FieldWrapper} schema={props.schema}>
        {Object.entries(schema).map(([key, value]) => (
          <div
            key={key}
            className={cn(
              "flex w-full gap-1",
              value.type === "boolean" ? "flex-row-reverse" : "flex-col"
            )}
          >
            <Label
              htmlFor={key}
              className={cn(
                "text-secondary-800 dark:text-secondary-200 select-none text-sm font-medium leading-snug capitalize",
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
    </DuckForm>
  );
}
