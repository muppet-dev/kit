import type { PropsWithChildren } from "react";
import {
  TracingProvider,
  NotificationProvider,
  ConnectionProvider,
  PingServerProvider,
  ShikiProvider,
} from "../providers";
import { SidebarProvider } from "./ui/sidebar";

export function AppProviders(props: PropsWithChildren) {
  return (
    <TracingProvider>
      <NotificationProvider>
        <ConnectionProvider>
          <PingServerProvider>
            <ShikiProvider>
              <SidebarProvider>{props.children}</SidebarProvider>
            </ShikiProvider>
          </PingServerProvider>
        </ConnectionProvider>
      </NotificationProvider>
    </TracingProvider>
  );
}
