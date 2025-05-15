import { PageHeader } from "./PageHeader";
import { PageRender } from "./Render";
import { MCPScanProvider } from "./providers";

export default function MCPScanPage() {
  return (
    <MCPScanProvider>
      <div className="p-4 size-full flex flex-col gap-4">
        <PageHeader />
        <PageRender />
      </div>
    </MCPScanProvider>
  );
}
