import { eventHandler } from "@/client/lib/eventHandler";
import { useConfig } from "@/client/providers";
import { X } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SidebarGroup, SidebarMenu } from "../ui/sidebar";

export function VersionBanner() {
  const { version, npmVersion } = useConfig();
  const isOldVersion =
    version != null && npmVersion
      ? isOlderVersion(version, npmVersion.version)
      : false;
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
            <p>A new version of the inspector is available.</p>
            <a
              href="https://www.npmjs.com/package/@muppet-kit/inspector"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge className="w-full mt-2">
                @muppet-kit/inspector@{npmVersion?.version}
              </Badge>
            </a>
          </CardContent>
        </Card>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function isOlderVersion(current: string, fromNpm: string): boolean {
  const cur = current.split(".").map(Number);
  const npm = fromNpm.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    const curVal = cur[i] ?? 0;
    const npmVal = npm[i] ?? 0;
    if (npmVal > curVal) return true;
    if (npmVal < curVal) return false;
  }

  return false;
}
