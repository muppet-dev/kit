import { Transport } from "@muppet-kit/shared";
import { useFormContext, useWatch } from "react-hook-form";
import type z from "zod";
import type { configTransportSchema } from "../../../validations";
import { SSEFields } from "./SSE";
import { STDIOFields } from "./STDIO";

export function OptionalFields() {
  const { control } = useFormContext<z.infer<typeof configTransportSchema>>();
  const type = useWatch({ control, name: "type" });

  if (type === Transport.STDIO) return <STDIOFields />;
  return <SSEFields />;
}
