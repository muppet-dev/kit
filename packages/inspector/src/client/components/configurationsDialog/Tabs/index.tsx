import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Configurations } from "./Configurations";
import { Connect } from "./Connect";

export function ConfigTabs() {
  return (
    <Tabs defaultValue="connect" className="w-full h-full gap-4">
      <TabsList className="w-full">
        <TabsTrigger
          value="connect"
          className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
        >
          Connect
        </TabsTrigger>
        <TabsTrigger
          value="quick-connect"
          className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
        >
          Quick Connect
        </TabsTrigger>
      </TabsList>
      <TabsContent value="connect" className="flex">
        <Connect />
      </TabsContent>
      <TabsContent value="quick-connect">
        <Configurations />
      </TabsContent>
    </Tabs>
  );
}
