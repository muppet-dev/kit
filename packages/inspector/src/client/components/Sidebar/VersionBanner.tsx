import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig } from "@/client/providers";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { SidebarGroup, SidebarMenu } from "../ui/sidebar";

export function VersionBanner() {
  const { version, npmVersion } = useConfig();
  const isOldVersion =
    version && npmVersion ? isOlderVersion(version, npmVersion.version) : false;
  const [isOpenBanner, setOpenBanner] = useState(isOldVersion);

  const handleCloseBanner = eventHandler(() => setOpenBanner(false));

  if (!isOpenBanner) return null;

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Card className="py-2">
          <CardHeader className="flex gap-2 px-2">
            <div className="rounded-full p-1 bg-warning m-1" />
            <CardTitle className="text-xs flex-1">
              A new version (
              <span className="font-bold">{npmVersion?.version}</span>) is
              available. You are using{" "}
              <span className="font-bold">{version}</span>. Please update.
            </CardTitle>
            <Button
              variant="ghost"
              className="size-max has-[>svg]:px-1 py-1"
              onClick={handleCloseBanner}
              onKeyDown={handleCloseBanner}
            >
              <X />
            </Button>
          </CardHeader>
        </Card>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function isOlderVersion(current: string, latest: string): boolean {
  const cur = current.split(".").map(Number);
  const lat = latest.split(".").map(Number);

  for (let i = 0; i < Math.max(cur.length, lat.length); i++) {
    const curVal = cur[i] ?? 0;
    const latVal = lat[i] ?? 0;
    if (latVal > curVal) return true;
    if (latVal < curVal) return false;
  }

  return false;
}
