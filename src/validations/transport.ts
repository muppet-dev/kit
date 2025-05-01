import { Transport } from "@/constants";
import z from "zod";

export const transportSchema = z.union([
  z.object({
    transportType: z.literal(Transport.STDIO),
    command: z.string(),
    args: z.string().optional(),
    env: z.string().optional(),
  }),
  z.object({
    transportType: z.literal(Transport.SSE),
    url: z.string().url(),
    bearerToken: z.string().optional(),
  }),
]);
