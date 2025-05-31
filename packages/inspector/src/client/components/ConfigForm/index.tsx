import { zodResolver } from "@hookform/resolvers/zod";
import {
  Transport,
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import type { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import z from "zod";
import type { ConnectionInfo } from "../../providers/connection/manager";
import { configTransportSchema as schema } from "../../validations";
import { useConfigForm } from "./useConfigForm";

export const DEFAULT_VALUES = {
  request_timeout: 10000,
  progress: true,
  total_timeout: 60000,
};

export type ConfigForm = PropsWithChildren<{
  data?: ConnectionInfo;
}>;

export function ConfigForm(props: ConfigForm) {
  const [searchParams] = useSearchParams();
  const mutation = useConfigForm();

  const params = z
    .union([stdioTransportSchema.partial(), remoteTransportSchema.partial()])
    .parse(Object.fromEntries(searchParams.entries()));

  let defaultValues: any = {
    type: Transport.STDIO,
    ...DEFAULT_VALUES,
    ...params,
  };

  if (props.data) {
    if (props.data.type === Transport.STDIO) {
      defaultValues = {
        ...props.data,
        // @ts-expect-error: converting data from string to array of object
        env: Object.entries(JSON.parse(props.data.env || "{}")).map(
          ([key, value]) => ({
            key,
            value,
          }),
        ),
      };
    } else {
      defaultValues = props.data;
    }
  }

  const methods = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col h-full gap-4 flex-1"
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error,
        )}
      >
        {props.children}
      </form>
    </FormProvider>
  );
}
