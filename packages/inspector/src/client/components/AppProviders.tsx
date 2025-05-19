import type { PropsWithChildren } from "react";
import {
  TracingProvider,
  NotificationProvider,
  ConnectionProvider,
  PingServerProvider,
  ShikiProvider,
} from "../providers";
import { SidebarProvider } from "./ui/sidebar";
import { RootsProvider } from "../providers/roots";

export function AppProviders(props: PropsWithChildren) {
  return (
    <TracingProvider>
      <NotificationProvider>
        <RootsProvider>
          <ConnectionProvider>
            <PingServerProvider>
              <ShikiProvider>
                <SidebarProvider>{props.children}</SidebarProvider>
              </ShikiProvider>
            </PingServerProvider>
          </ConnectionProvider>
        </RootsProvider>
      </NotificationProvider>
    </TracingProvider>
  );
}
