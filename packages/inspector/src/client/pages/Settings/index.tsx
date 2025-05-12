import { ConfigForm } from "../../components/ConfigForm";
import { ConfigFormFields } from "../../components/ConfigFormFields";
import { Card, CardContent } from "../../components/ui/card";
import { useConfig } from "../../providers";
import { FormFooter } from "./Footer";

export default function SettingsPage() {
  const { connectionInfo } = useConfig();

  return (
    <div className="p-4 max-w-4xl w-full mx-auto flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-2xl font-bold">Settings</h2>
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
