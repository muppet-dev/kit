import { useFormContext } from "react-hook-form";
import { ConfigForm } from "./ConfigForm";
import type z from "zod";
import type { transportSchema } from "../../../server/src/validations/transport";
import { Button } from "./ui/button";

export function SettingsPage() {
  // TODO: retch config data and pass it in data prop in Config Form

  return (
    <div className="p-4 w-full flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-2xl font-bold">Settings</h2>
      <ConfigForm onSubmit={console.log} footer={<FormFooter />} />
    </div>
  );
}

function FormFooter() {
  const { reset } = useFormContext<z.infer<typeof transportSchema>>();

  // TODO: put default values of config
  const handleResetForm = () => reset();

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
