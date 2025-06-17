import { FieldWrapper, quackFields } from "@/client/components/fields";
import type { JSONSchema7 } from "json-schema";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { DuckField } from "../../../../../components/DuckField";
import { Blueprint, DuckForm } from "../../../../../providers";
import type { ToolItemType } from "../../../types";

export function ToolFieldsRender(props: ToolItemType) {
  const { reset } = useFormContext();
  if (!props.schema) return <></>;

  const { schema, defaultValue } = useMemo(() => {
    const inputSchema = props.inputSchema as any;
    const schema = transformSchema(props.schema, inputSchema?.required);

    const defaultValue = getDefaultValues(props.schema as Record<string, any>);

    return {
      schema,
      defaultValue,
    };
  }, [props.schema, props.inputSchema]);

  useEffect(() => {
    if (defaultValue) reset(defaultValue, { keepIsSubmitSuccessful: true });
  }, [defaultValue, reset]);

  if (!schema || Object.keys(schema).length === 0)
    return (
      <div className="size-full flex items-center justify-center text-muted-foreground select-none text-sm">
        No fields to display
      </div>
    );

  return (
    <DuckForm
      components={quackFields}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <Blueprint wrapper={FieldWrapper} schema={schema}>
        {Object.keys(schema).map((key) => (
          <DuckField key={key} id={key} />
        ))}
      </Blueprint>
    </DuckForm>
  );
}

function transformSchema(
  schema: ToolItemType["schema"] = {},
  requiredFields: string[] = [],
): JSONSchema7["properties"] {
  return Object.entries(schema).reduce<JSONSchema7["properties"]>(
    (prev, [key, value]) => {
      if (!value || typeof value !== "object") return prev;

      const tmp = prev ?? {};
      const isRequired = requiredFields.includes(key);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const field: any = {
        ...value,
        label: "label" in value ? value.label : key,
        required: isRequired ?? value.required,
      };

      if (value.type === "object") {
        const subRequired = "required" in value ? (value.required ?? []) : [];
        field.properties = transformSchema(value.properties, subRequired);
      }

      if (value.type === "array") {
        const items = value.items;
        if (
          items &&
          typeof items === "object" &&
          // @ts-expect-error TypeScript cannot infer the type of 'items.type' as 'object' here
          items.type === "object" &&
          "properties" in items
        ) {
          const itemRequired =
            "required" in items ? (items.required ?? []) : [];
          field.items = {
            ...items,
            properties: transformSchema(items.properties, itemRequired),
          };
        }
      }

      tmp[key] = field;
      return tmp;
    },
    {},
  );
}

function getDefaultValues(schema: Record<string, any>) {
  const defaults: Record<string, any> = {};

  for (const [key, value] of Object.entries(schema ?? {})) {
    if (value && typeof value === "object") {
      if ("default" in value) defaults[key] = value.default;

      if (value.type === "object" && value.properties) {
        const nestedDefaults = getDefaultValues(value.properties);
        if (nestedDefaults !== undefined) {
          defaults[key] = {
            ...value.default,
            ...nestedDefaults,
          };
        }
      }

      if (value.type === "array" && value.items) {
        if ("default" in value.items) defaults[key] = [value.items.default];

        if (value.items.type === "object" && value.items.properties) {
          const nestedDefaults = getDefaultValues(value.items.properties);
          if (nestedDefaults !== undefined) {
            defaults[key] = [nestedDefaults];
          }
        }
      }
    }
  }

  return Object.keys(defaults).length > 0 ? defaults : undefined;
}
