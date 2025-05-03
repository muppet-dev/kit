import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "./providers/config";
import { ThemeProvider } from "./providers/theme";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider>
    <ThemeProvider>
      <App />
      <Toaster />
    </ThemeProvider>
  </ConfigProvider>,
);
