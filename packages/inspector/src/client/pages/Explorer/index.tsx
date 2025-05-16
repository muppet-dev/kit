import { SidebarInset } from "@/client/components/ui/sidebar";
import { ExplorerRender } from "./Render";
import { MCPItemProvider, ToolProvider } from "./providers";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { RootsRender } from "./RootsRender";

export default function ExplorerPage() {
  return (
    <SidebarInset>
      <Tabs className="h-full" defaultValue="explorer">
        <TabsList className="w-full p-0 bg-background justify-start gap-4 text-md border-b rounded-none overflow-x-auto">
          <TabsTrigger
            value="explorer"
            className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary dark:data-[state=active]:border-input/0 dark:data-[state=active]:border-b-foreground dark:data-[state=active]:bg-transparent max-w-max"
          >
            Explorer
          </TabsTrigger>
          <TabsTrigger
            value="roots"
            className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary dark:data-[state=active]:border-input/0 dark:data-[state=active]:border-b-foreground dark:data-[state=active]:bg-transparent max-w-max"
          >
            Roots
          </TabsTrigger>
        </TabsList>
        <TabsContent value="explorer">
          <ToolProvider>
            <MCPItemProvider>
              <div className="size-full px-4">
                <ExplorerRender />
              </div>
            </MCPItemProvider>
          </ToolProvider>
        </TabsContent>
        <TabsContent value="roots">
          <RootsRender />
        </TabsContent>
      </Tabs>
    </SidebarInset>
  );
}
