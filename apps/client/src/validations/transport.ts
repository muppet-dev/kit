import { TransportType } from "@/constants";
import { z } from "zod";

export const transportSchema = z.union([
  z.object({
    transportType: z.literal(TransportType.STDIO),
    command: z.string(),
    args: z.string().optional(),
    env: z.string().optional(),
  }),
  z.object({
    transportType: z.literal(TransportType.SSE),
    url: z.string().url(),
    bearerToken: z.string().optional(),
  }),
]);
