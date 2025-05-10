import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider, ThemeProvider } from "./providers";
import toast, { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    <ConfigProvider>
      <ThemeProvider>
        <App />
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </ConfigProvider>
  </QueryClientProvider>
);
