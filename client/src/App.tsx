import { NotFound } from "@/components/NotFound";
import { AppWrapper } from "@/components/Wrapper";
import { ConfigurationsDialog } from "@/components/configurationsDialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import ExplorerPage from "./pages/Explorer";
import PlaygroundPage from "./pages/Playground";
import SettingsPage from "./pages/Settings";
import TracingPage from "./pages/Tracing";
import { ConnectionProvider, ShikiProvider, useConfig } from "@/providers";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  const { connectionInfo, setConnectionInfo } = useConfig();

  if (!connectionInfo) {
    return <ConfigurationsDialog onSubmit={setConnectionInfo} />;
  }

  return (
    <ConnectionProvider {...connectionInfo}>
      <ShikiProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppWrapper />}>
                <Route path="/explorer" element={<ExplorerPage />} />
                <Route path="/playground" element={<PlaygroundPage />} />
                <Route path="/tracing" element={<TracingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </ShikiProvider>
    </ConnectionProvider>
  );
}

export default App;
