import {
  ConnectionProvider,
  ShikiProvider,
  ToolProvider,
  useConfig,
} from "@/providers";
import { BrowserRouter, Route, Routes } from "react-router";
import ConfigurationsDialog from "./components/configurationsDialog";
import { PlaygroundPage } from "./components/Playground";
import { SettingsPage } from "./components/Settings";
import { TracingPage } from "./components/Tracing";
import { SidebarProvider } from "./components/ui/sidebar";
import Wrapper from "./components/Wrapper";
import { ExplorerPage } from "./components/Playground/Explorer";
import { LLMScoringPage } from "./components/Playground/LLMScoring";

function App() {
  const { connectionInfo, setConnectionInfo } = useConfig();

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
                      path="/playground/explorer"
                      element={<ExplorerPage />}
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
