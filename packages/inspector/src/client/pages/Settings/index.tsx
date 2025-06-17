import { Button } from "@/client/components/ui/button";
import { eventHandler } from "@/client/lib/eventHandler";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { ConfigForm, DEFAULT_VALUES } from "../../components/ConfigForm";
import { ConfigFormFields } from "../../components/ConfigFormFields";
import { Card, CardContent } from "../../components/ui/card";
import { useConfig } from "../../providers";
import { FormFooter } from "./Footer";

export default function SettingsPage() {
  const { connectionInfo } = useConfig();
  const [_, setCopy] = useCopyToClipboard();

  const handleShareConfig = eventHandler(() => {
    const url = new URL(window.location.host);

    const params = new URLSearchParams();

    const excludeKeys = ["name", ...Object.keys(DEFAULT_VALUES)];

    if (connectionInfo)
      for (const [key, value] of Object.entries(connectionInfo)) {
        if (value != null && !excludeKeys.includes(key)) {
          params.set(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value),
          );
        }
      }

    url.search = params.toString();

    setCopy(url.toString());
    toast.success("Configuration URL copied to clipboard");
  });

  return (
    <div className="p-4 max-w-4xl w-full mx-auto flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button
          variant="outline"
          onClick={handleShareConfig}
          onKeyDown={handleShareConfig}
        >
          <Share2 />
          Share
        </Button>
      </div>
      <Card className="py-4 shadow-lg">
        <CardContent className="px-4">
          <ConfigForm data={connectionInfo}>
            <ConfigFormFields />
            <FormFooter />
          </ConfigForm>
        </CardContent>
      </Card>
    </div>
  );
}
