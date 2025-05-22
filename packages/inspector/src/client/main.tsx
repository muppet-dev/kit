import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import toast, { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";
import { ConfigProvider } from "./providers";
import { PreferencesProvider, usePreferences } from "./providers/preferences";

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

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <PreferencesProvider>
      <BrowserRouter>
        <ConfigProvider>
          <Render />
        </ConfigProvider>
      </BrowserRouter>
    </PreferencesProvider>
  </QueryClientProvider>
);

function Render() {
  const { toastPosition } = usePreferences();

  return (
    <>
      <App />
      <Toaster position={toastPosition} />
    </>
  );
}
