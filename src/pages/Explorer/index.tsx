import { Explorer } from "./Explorer";
import { ExplorerWrapper } from "./Wrapper";
import { ToolProvider } from "./tools";

export default function ExplorerPage() {
  return (
    <ToolProvider>
      <ExplorerWrapper>
        <Explorer />
      </ExplorerWrapper>
    </ToolProvider>
  );
}
