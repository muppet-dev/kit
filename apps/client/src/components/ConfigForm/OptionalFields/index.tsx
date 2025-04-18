import { useFormContext, useWatch } from "react-hook-form";
import type { transportSchema } from "../../../../../server/src/validations/transport";
import type z from "zod";
import { TransportType } from "@/constants";
import { STDIOFields } from "./Stdio";
import { SSEFields } from "./Sse";

export function OptionalFields() {
  const { control } = useFormContext<z.infer<typeof transportSchema>>();
  const transportType = useWatch({ control, name: "transportType" });

  if (transportType === TransportType.SSE) return <SSEFields />;
  return <STDIOFields />;
}
