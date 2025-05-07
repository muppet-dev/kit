import { SidebarInset } from "@/components/ui/sidebar";
import { Explorer } from "./Explorer";
import { ToolProvider } from "./tools";

export default function ExplorerPage() {
  return (
    <ToolProvider>
      <SidebarInset>
        <div className="size-full p-4 pt-0">
          <Explorer />
        </div>
      </SidebarInset>
    </ToolProvider>
  );
}
