import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfigProvider } from "./providers/config.tsx";
import { ThemeProvider } from "./providers/theme.tsx";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ConfigProvider>,
);
