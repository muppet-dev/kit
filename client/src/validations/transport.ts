import { Transport } from "@/constants";
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
      .optional()
      .transform((val) => {
        if (!val) return undefined;

        const env: Record<string, string> = {};

        for (const { key, value } of val) {
          env[key] = value;
        }

        return JSON.stringify(env);
      }),
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
