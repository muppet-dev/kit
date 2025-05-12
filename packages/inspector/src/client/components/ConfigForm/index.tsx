import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { configTransportSchema as schema } from "@/client/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Transport,
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import { type PropsWithChildren, useEffect } from "react";
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
      transportType: Transport.STDIO,
      ...params,
    },
  });

  const { handleSubmit, reset } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col h-full gap-2 flex-1"
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
