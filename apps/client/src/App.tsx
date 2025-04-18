import { useState } from "react";
import Wrapper from "./components/Wrapper";
import { ConnectionProvider, ShikiProvider, ToolProvider } from "@/providers";
import type { ConnectionInfo } from "./hooks/use-connection";
import ConfigurationsDialog from "./components/configurationsDialog";
import Scanner from "./components/Playground/Scanner";

function App() {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(
    null
  );

  if (!connectionInfo) {
    return <ConfigurationsDialog onSubmit={setConnectionInfo} />;
  }

  return (
    <ConnectionProvider {...connectionInfo}>
      <ToolProvider>
        <ShikiProvider>
          <Wrapper>
            <Scanner />
          </Wrapper>
        </ShikiProvider>
      </ToolProvider>
    </ConnectionProvider>
  );
}

export default App;
