import { SidebarInset } from "@/components/ui/sidebar";
import { Explorer } from "./Explorer";
import { ToolProvider } from "./tools";
import { Tabs } from "./Tabs";

export default function ExplorerPage() {
  return (
    <ToolProvider>
      <SidebarInset className="w-full h-full overflow-hidden flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <Tabs />
        </header>
        <div className="flex-1 overflow-y-auto flex h-full w-full flex-col gap-4 p-4 pt-0">
          <Explorer />
        </div>
      </SidebarInset>
    </ToolProvider>
  );
}
