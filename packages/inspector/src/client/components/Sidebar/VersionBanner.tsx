import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig } from "@/client/providers";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
        <Card className="py-2 gap-1">
          <CardHeader className="flex gap-1 items-center px-2">
            <div className="rounded-full p-1 bg-warning m-1" />
            <CardTitle className="text-xs flex-1 text-warning">
              New Version
            </CardTitle>
            <Button
              title="Close"
              variant="ghost"
              className="size-max has-[>svg]:px-0.5 py-0.5"
              onClick={handleCloseBanner}
              onKeyDown={handleCloseBanner}
            >
              <X className="size-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="px-2 text-xs space-y-1">
            <p>A new version of @muppet-kit/inspector is available!</p>
            <table className="w-full">
              <tbody>
                <tr>
                  <td>Latest available:</td>
                  <td className="text-right">{npmVersion?.version}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
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
