import { Blueprint, DuckField, DuckForm } from "duck-form";
import type { JSONSchema7 } from "json-schema";
import { quackFields } from "./fields";
import { FieldWrapper } from "./fields/FieldWrapper";

export type FormRender = {
  schema?: JSONSchema7["properties"] | JSONSchema7[];
};

export function FormRender(props: FormRender) {
  if (!props.schema) return <></>;

  const schema: Record<string, unknown> = Array.isArray(props.schema)
    ? props.schema.reduce((prev, cur) => {
        if (typeof cur === "object" && "name" in cur)
          prev[cur.name] = { label: "label" in cur ? cur.label : cur.name };
        else prev[cur] = { label: cur };
        return prev;
      }, {})
    : transformSchema(props.schema);

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
  schema: JSONSchema7["properties"] = {},
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

      if (value.type === "object" && "properties" in value) {
        const subRequired = "required" in value ? value.required ?? [] : [];
        field.properties = transformSchema(value.properties, subRequired);
      }

      if (value.type === "array" && "items" in value) {
        const items = value.items;
        if (
          items &&
          typeof items === "object" &&
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
