import { ConfigForm } from "@/components/ConfigForm";
import { Card, CardContent } from "@/components/ui/card";
import { useConfig, useConnection } from "@/providers";
import { FormFooter } from "./Footer";

export default function SettingsPage() {
  const { connectionInfo, setConnectionInfo } = useConfig();
  const { connect, disconnect } = useConnection();

  return (
    <div className="p-4 max-w-4xl w-full mx-auto flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-2xl font-bold">Settings</h2>
      <Card className="py-4 shadow-lg">
        <CardContent className="px-4">
          <ConfigForm
            data={connectionInfo}
            onSubmit={async (values) => {
              setConnectionInfo(values);
              await disconnect();
              await connect();
            }}
          >
            <FormFooter />
          </ConfigForm>
        </CardContent>
      </Card>
    </div>
  );
}
