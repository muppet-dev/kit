import { NotFound } from "@/components/NotFound";
import { AppWrapper } from "@/components/Wrapper";
import { ConfigurationsDialog } from "@/components/configurationsDialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ConnectionProvider, ShikiProvider, useConfig } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import ExplorerPage from "./pages/Explorer";
import { HomePage } from "./pages/Home";
import PlaygroundPage from "./pages/Playground";
import SettingsPage from "./pages/Settings";
import TracingPage from "./pages/Tracing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (err, query) => {
        console.error(query, err);
        toast.error(err.message ?? "Something went wrong!");

        return false;
      },
      staleTime: Number.POSITIVE_INFINITY,
    },
    mutations: {
      onError: (err) => {
        console.error(err);
        toast.error(err.message ?? "Something went wrong!");
      },
    },
  },
});

function App() {
  const { connectionInfo, setConnectionInfo } = useConfig();

  if (!connectionInfo) {
    return <ConfigurationsDialog onSubmit={setConnectionInfo} />;
  }

  return (
    <ConnectionProvider>
      <QueryClientProvider client={queryClient}>
        <ShikiProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AppWrapper />}>
                  <Route index element={<HomePage />} />
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
      </QueryClientProvider>
    </ConnectionProvider>
  );
}

export default App;
