import { ConfigForm } from "@/components/ConfigForm";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/providers";
import type { transportSchema } from "@/validations";
import { useFormContext } from "react-hook-form";
import type z from "zod";

export default function SettingsPage() {
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

  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={() => reset(connectionInfo)}
        onKeyDown={(event) => {
          if (event.key === "Enter") reset(connectionInfo);
        }}
      >
        Reset
      </Button>
      <Button type="submit">Save & connect</Button>
    </div>
  );
}
