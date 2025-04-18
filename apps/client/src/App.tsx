import { useState } from "react";
import Wrapper from "./components/Wrapper";
import { ConnectionProvider } from "@/providers/connection";
import { ConnectionInfo } from "./hooks/use-connection";
import ConfigurationsDialog from "./components/configurationsDialog";

function App() {
const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);

if (!connectionInfo) {
  return <ConfigurationsDialog isOpen={!connectionInfo} onSubmit={setConnectionInfo} />;
}

  return (
    <ConnectionProvider {...connectionInfo}>
      <Wrapper>
        <div></div>
      </Wrapper>
    </ConnectionProvider>
  )
}

export default App;
