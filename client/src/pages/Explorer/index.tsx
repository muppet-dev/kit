import { SidebarInset } from "@/components/ui/sidebar";
import { ExplorerRender } from "./Render";
import { ToolProvider } from "./providers";
import { MCPItemProvider } from "./providers/item";

export default function ExplorerPage() {
  return (
    <SidebarInset>
      <ToolProvider>
        <MCPItemProvider>
          <div className="size-full p-4 pt-0">
            <ExplorerRender />
          </div>
        </MCPItemProvider>
      </ToolProvider>
    </SidebarInset>
  );
}
