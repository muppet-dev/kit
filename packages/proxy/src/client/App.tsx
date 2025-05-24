import { AppWrapper } from "@/client/components/AppWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import { NotFound } from "./components/NotFound";
import { SidebarProvider } from "./components/ui/sidebar";
import DashboardPage from "./pages/Dashboard";
import { HomePage } from "./pages/Home";
import TracingPage from "./pages/Tracing";
import {
  PreferencesProvider,
  TracingProvider,
  usePreferences,
} from "./providers";
import { ConfigProvider } from "./providers/config";
import { ShikiProvider } from "./providers/shiki";

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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <ConfigProvider>
          <TracingProvider>
            <ShikiProvider>
              <SidebarProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<AppWrapper />}>
                      <Route index element={<HomePage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/tracing" element={<TracingPage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                <ToastRender />
              </SidebarProvider>
            </ShikiProvider>
          </TracingProvider>
        </ConfigProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}

function ToastRender() {
  const { toastPosition } = usePreferences();

  return <Toaster position={toastPosition} />;
}
