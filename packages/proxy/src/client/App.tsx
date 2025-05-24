import { AppWrapper } from "@/client/components/AppWrapper";
import { BrowserRouter, Route, Routes } from "react-router";
import DashboardPage from "./pages/Dashboard";
import TracingPage from "./pages/Tracing";
import { SidebarProvider } from "./components/ui/sidebar";

export default function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tracing" element={<TracingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}
