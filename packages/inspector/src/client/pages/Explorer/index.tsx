import { SidebarInset } from "../../components/ui/sidebar";
import { ExplorerRender } from "./Render";
import { MCPItemProvider, ToolProvider } from "./providers";

export default function ExplorerPage() {
  return (
    <SidebarInset>
      <ToolProvider>
        <MCPItemProvider>
          <div className="size-full px-4">
            <ExplorerRender />
          </div>
        </MCPItemProvider>
      </ToolProvider>
    </SidebarInset>
  );
}
