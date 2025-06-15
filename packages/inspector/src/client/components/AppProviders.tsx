import type { PropsWithChildren } from "react";
import {
  ConnectionProvider,
  NotificationProvider,
  PingServerProvider,
  SamplingProvider,
  ShikiProvider,
  TracingProvider,
} from "../providers";
import { RootsProvider } from "../providers/roots";
import { SidebarProvider } from "./ui/sidebar";

export function AppProviders(props: PropsWithChildren) {
  return (
    <TracingProvider>
      <NotificationProvider>
        <RootsProvider>
          <SamplingProvider>
            <ConnectionProvider>
              <PingServerProvider>
                <ShikiProvider>
                  <SidebarProvider>{props.children}</SidebarProvider>
                </ShikiProvider>
              </PingServerProvider>
            </ConnectionProvider>
          </SamplingProvider>
        </RootsProvider>
      </NotificationProvider>
    </TracingProvider>
  );
}
