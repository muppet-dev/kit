import { Outlet } from "react-router";
import { AppSidebar } from "./sidebar";

export function AppWrapper() {
  return (
    <>
      <AppSidebar />
      <Outlet />
    </>
  );
}
