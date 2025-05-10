import { Transport } from "@muppet-kit/shared";
import z from "zod";

export const transportSchema = z.union([
  z.object({
    transportType: z.literal(Transport.STDIO),
    command: z.string(),
    args: z.string().optional(),
    env: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
  z.object({
    transportType: z.union([
      z.literal(Transport.SSE),
      z.literal(Transport.HTTP),
    ]),
    url: z.string().url(),
    headerName: z.string().optional(),
    bearerToken: z.string().optional(),
  }),
]);
