import { Button } from "@/components/ui/button";
import { eventHandler } from "@/lib/eventHandler";
import { useConfig } from "@/providers";
import type { transportSchema } from "@/validations";
import _ from "lodash";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";

export function FormFooter() {
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
