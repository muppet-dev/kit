import type { ConnectionInfo } from "@/client/providers/connection/manager";
import { configTransportSchema as schema } from "@/client/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transport } from "@muppet-kit/shared";
import type { PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ConfigurationsInfo } from "./ConfigurationsInfo";
import { FormRender } from "./FormRender";

export type ConfigForm = {
  onSubmit: (values: ConnectionInfo) => void;
  data?: ConnectionInfo;
  isTab?: boolean;
};

export function ConfigForm({
  isTab = false,
  ...props
}: PropsWithChildren<ConfigForm>) {
  const methods = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: props.data ?? {
      transportType: Transport.STDIO,
    },
  });

  return (
    <FormProvider {...methods}>
      {isTab ? (
        <Tabs defaultValue="connect" className="w-full h-full gap-4">
          <TabsList className="w-full">
            <TabsTrigger
              value="connect"
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Connect
            </TabsTrigger>
            <TabsTrigger
              value="configurations"
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Saved Configurations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="connect">
            <FormRender onSubmit={props.onSubmit} isTab={isTab}>
              {props.children}
            </FormRender>
          </TabsContent>
          <TabsContent value="configurations">
            <ConfigurationsInfo onSubmit={props.onSubmit} />
          </TabsContent>
        </Tabs>
      ) : (
        <FormRender onSubmit={props.onSubmit}>{props.children}</FormRender>
      )}
    </FormProvider>
  );
}
