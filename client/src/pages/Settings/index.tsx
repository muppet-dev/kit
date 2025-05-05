import { ConfigForm } from "@/components/ConfigForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { eventHandler } from "@/lib/eventHandler";
import { useConfig } from "@/providers";
import type { transportSchema } from "@/validations";
import _ from "lodash";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";

export default function SettingsPage() {
  const { connectionInfo, setConnectionInfo } = useConfig();

  return (
    <div className="p-4 w-4xl mx-auto flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-2xl font-bold">Settings</h2>
      <Card className="py-4 shadow-lg">
        <CardContent className="px-4">
          <ConfigForm
            data={connectionInfo}
            onSubmit={(values) => setConnectionInfo(values)}
            footer={<FormFooter />}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function FormFooter() {
  const { connectionInfo } = useConfig();
  const { reset, control } = useFormContext<z.infer<typeof transportSchema>>();

  const formValues = useWatch({ control });
  const isSameValues = _.isEqual(formValues, connectionInfo);

  const handleResetForm = eventHandler(() => reset(connectionInfo));

  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        disabled={isSameValues}
        onClick={handleResetForm}
        onKeyDown={handleResetForm}
      >
        Reset
      </Button>
      <Button type="submit" disabled={isSameValues}>
        Save & connect
      </Button>
    </div>
  );
}
