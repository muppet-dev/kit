import { Blueprint, DuckField, DuckForm } from "duck-form";
import type { JSONSchema7 } from "json-schema";
import { quackFields } from "./fields";
import { FieldWrapper } from "./fields/FieldWrapper";
import type { ToolItemType } from "@/pages/Explorer/types";

export function ToolFieldsRender(props: ToolItemType) {
  if (!props.schema) return <></>;

  const schema = transformSchema(props.schema);

  return (
    <DuckForm
      components={quackFields}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <Blueprint wrapper={FieldWrapper} schema={schema}>
        {schema &&
          Object.keys(schema).map((key) => <DuckField key={key} id={key} />)}
      </Blueprint>
    </DuckForm>
  );
}

function transformSchema(
  schema: ToolItemType["schema"] = {},
  requiredFields: string[] = []
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
        const subRequired = "required" in value ? value.required ?? [] : [];
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
          const itemRequired = "required" in items ? items.required ?? [] : [];
          field.items = {
            ...items,
            properties: transformSchema(items.properties, itemRequired),
          };
        }
      }

      tmp[key] = field;
      return tmp;
    },
    {}
  );
}
