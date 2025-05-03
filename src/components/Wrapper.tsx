import { AppSidebar } from "@/components/Sidebar";
import { Outlet } from "react-router";

export function AppWrapper() {
  return (
    <>
      <AppSidebar />
      <Outlet />
    </>
  );
}
