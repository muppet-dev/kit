import { SidebarInset } from "@/client/components/ui/sidebar";
import { ExplorerRender } from "./Render";
import { MCPItemProvider, ToolProvider } from "./providers";

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
