import type { configTransportSchema } from "@/client/validations";
import { Transport } from "@muppet-kit/shared";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import { SSEFields } from "./SSE";
import { STDIOFields } from "./STDIO";

export function OptionalFields() {
  const { control } = useFormContext<z.infer<typeof configTransportSchema>>();
  const transportType = useWatch({ control, name: "transportType" });

  if (transportType === Transport.STDIO) return <STDIOFields />;
  return <SSEFields />;
}
