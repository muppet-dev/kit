import { useFormContext } from "react-hook-form";
import { ConfigForm } from "./ConfigForm";
import type z from "zod";
import type { transportSchema } from "@/validations";
import { Button } from "./ui/button";
import { useConfig } from "@/providers";

export function SettingsPage() {
  const { connectionInfo, setConnectionInfo } = useConfig();

  return (
    <div className="p-4 w-4xl mx-auto flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-2xl font-bold">Settings</h2>
      <ConfigForm
        data={connectionInfo}
        onSubmit={(values) => setConnectionInfo(values)}
        footer={<FormFooter />}
      />
    </div>
  );
}

function FormFooter() {
  const { connectionInfo } = useConfig();
  const { reset } = useFormContext<z.infer<typeof transportSchema>>();

  const handleResetForm = () => reset(connectionInfo);

  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        Reset
      </Button>
      <Button type="submit">Save & connect</Button>
    </div>
  );
}
