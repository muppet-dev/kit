import { ConnectionProvider, ToolProvider } from "@/providers";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import ConfigurationsDialog from "./components/configurationsDialog";
import { PlaygroundPage } from "./components/Playground";
import { SettingsPage } from "./components/Settings";
import { TracingPage } from "./components/Tracing";
import { SidebarProvider } from "./components/ui/sidebar";
import Wrapper from "./components/Wrapper";
import type { ConnectionInfo } from "./hooks/use-connection";
import { ShikiProvider } from "./providers/shiki";
import { ScannerPage } from "./components/Playground/Scanner";
import { LLMScoringPage } from "./components/Playground/LLMScoring";

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
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Wrapper />}>
                  <Route element={<PlaygroundPage />}>
                    <Route
                      path="/playground/scanner"
                      element={<ScannerPage />}
                    />
                    <Route
                      path="/playground/llm-scoring"
                      element={<LLMScoringPage />}
                    />
                  </Route>
                  <Route path="/tracing" element={<TracingPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </ShikiProvider>
      </ToolProvider>
    </ConnectionProvider>
  );
}

export default App;
