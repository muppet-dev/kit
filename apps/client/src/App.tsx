import { useState } from "react";
import Wrapper from "./components/Wrapper";
import { ConnectionProvider, ToolProvider } from "@/providers";
import type { ConnectionInfo } from "./hooks/use-connection";
import ConfigurationsDialog from "./components/configurationsDialog";

function App() {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(
    null,
  );

  if (!connectionInfo) {
    return <ConfigurationsDialog onSubmit={setConnectionInfo} />;
  }

  return (
    <ConnectionProvider {...connectionInfo}>
      <ToolProvider>
        <Wrapper>
          <div></div>
        </Wrapper>
      </ToolProvider>
    </ConnectionProvider>
  );
}

export default App;
