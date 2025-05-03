import { SidebarInset } from "@/components/ui/sidebar";
import { Explorer } from "./Explorer";
import { ToolProvider } from "./tools";
import { Tabs } from "./Tabs";

export default function ExplorerPage() {
  return (
    <ToolProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <Tabs />
        </header>
        <div className="flex h-full w-full flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] h-full w-full bg-muted/50 md:min-h-min flex">
            <Explorer />
          </div>
        </div>
      </SidebarInset>
    </ToolProvider>
  );
}
