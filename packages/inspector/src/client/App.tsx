import { NotFound } from "@/client/components/NotFound";
import { AppWrapper } from "@/client/components/Wrapper";
import { ConfigurationsDialog } from "@/client/components/configurationsDialog";
import { SidebarProvider } from "@/client/components/ui/sidebar";
import {
  ConnectionProvider,
  NotificationProvider,
  PingServerProvider,
  ShikiProvider,
  TracingProvider,
  useConfig,
} from "@/client/providers";
import { Transport } from "@muppet-kit/shared";
import { Route, Routes } from "react-router";
import ExplorerPage from "./pages/Explorer";
import HistoryPage from "./pages/History";
import { HomePage } from "./pages/Home";
import OAuthCallbackPage from "./pages/OAuthCallback";
import PlaygroundPage from "./pages/Playground";
import SettingsPage from "./pages/Settings";
import TracingPage from "./pages/Tracing";
import MCPScanPage from "./pages/MCPScan";

export default function App() {
  const { connectionInfo, setConnectionInfo } = useConfig();

  if (window.location.pathname === "/oauth/callback") {
    return (
      <OAuthCallbackPage
        onConnect={(url) => {
          setConnectionInfo({
            type: Transport.SSE,
            url,
          });
        }}
      />
    );
  }

  if (!connectionInfo) {
    return <ConfigurationsDialog />;
  }

  return (
    <TracingProvider>
      <NotificationProvider>
        <ConnectionProvider>
          <PingServerProvider>
            <ShikiProvider>
              <SidebarProvider>
                <Routes>
                  <Route path="/" element={<AppWrapper />}>
                    <Route index element={<HomePage />} />
                    <Route path="/explorer" element={<ExplorerPage />} />
                    <Route path="/playground" element={<PlaygroundPage />} />
                    <Route path="/mcp-scan" element={<MCPScanPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/tracing" element={<TracingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SidebarProvider>
            </ShikiProvider>
          </PingServerProvider>
        </ConnectionProvider>
      </NotificationProvider>
    </TracingProvider>
  );
}
