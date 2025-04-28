import { Tabs } from "@/components/Tabs";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export function ExplorerWrapper() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <Tabs />
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min">
          <Outlet />
        </div>
      </div>
    </SidebarInset>
  );
}
