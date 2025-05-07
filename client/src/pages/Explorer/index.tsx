import { SidebarInset } from "@/components/ui/sidebar";
import { ExplorerRender } from "./Render";
import { ToolProvider } from "./providers";

export default function ExplorerPage() {
  return (
    <ToolProvider>
      <SidebarInset>
        <div className="size-full p-4 pt-0">
          <ExplorerRender />
        </div>
      </SidebarInset>
    </ToolProvider>
  );
}
