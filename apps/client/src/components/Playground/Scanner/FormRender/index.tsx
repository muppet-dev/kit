"use client";

import { Blueprint, DuckField, DuckForm } from "duck-form";
import { quackFields } from "./fields";
import { FormProvider, useForm } from "react-hook-form";
import { BlockWrapper } from "./fields/BlockWrapper";
import type { FieldProps } from "./fields/types";
import { FieldType } from "./fields/constants";

export function FormRender() {
  const methods = useForm();

  const { handleSubmit } = methods;

  const schema: Record<string, FieldProps> = {
    name: {
      type: FieldType.TEXTAREA,
      label: "Description",
    },
  };

  return (
    <DuckForm
      components={quackFields}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            (values) => console.log(values),
            console.error
          )}
        >
          <Blueprint wrapper={BlockWrapper} schema={schema}>
            {Object.keys(schema).map((key) => (
              <DuckField key={key} id={key} />
            ))}
          </Blueprint>
        </form>
      </FormProvider>
    </DuckForm>
  );
}
