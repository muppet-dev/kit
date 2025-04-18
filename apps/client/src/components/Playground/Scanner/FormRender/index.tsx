"use client";

import { Blueprint, DuckField, DuckForm } from "duck-form";
import { quackFields } from "./fields";
import { FormProvider, useForm } from "react-hook-form";
import { BlockWrapper } from "./fields/BlockWrapper";
import { Label } from "@/components/ui/label";
import { Fragment } from "react/jsx-runtime";

export type FormRenderProps = {
  schema?: any;
};

export function FormRender(props: FormRenderProps) {
  const methods = useForm();

  const { handleSubmit } = methods;

  if (!props.schema) {
    return <></>;
  }

  return (
    <DuckForm
      components={quackFields}
      generateId={(_, props) => (props.id ? String(props.id) : undefined)}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(
            (values) => console.log(values),
            console.error,
          )}
        >
          <Blueprint wrapper={BlockWrapper} schema={props.schema}>
            {Object.keys(props.schema).map((key) => (
              <Fragment key={key}>
                <Label className="mb-1">{key}</Label>
                <DuckField id={key} />
              </Fragment>
            ))}
          </Blueprint>
        </form>
      </FormProvider>
    </DuckForm>
  );
}
