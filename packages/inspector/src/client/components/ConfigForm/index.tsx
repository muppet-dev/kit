import type { ConnectionInfo } from "../../providers/connection/manager";
import { configTransportSchema as schema } from "../../validations";
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
import { useConfigForm } from "./useConfigForm";

export type ConfigForm = PropsWithChildren<{
  data?: ConnectionInfo;
}>;

export function ConfigForm(props: ConfigForm) {
  const [searchParams] = useSearchParams();
  const mutation = useConfigForm();

  const params = z
    .union([stdioTransportSchema.partial(), remoteTransportSchema.partial()])
    .parse(Object.fromEntries(searchParams.entries()));

  const methods = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: props.data ?? {
      request_timeout: 10000,
      progress: true,
      total_timeout: 60000,
      type: Transport.STDIO,
      ...params,
    },
  });

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col h-full gap-4 flex-1"
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error
        )}
      >
        {props.children}
      </form>
    </FormProvider>
  );
}
