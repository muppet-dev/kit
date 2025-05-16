import z from "zod";
import { Transport } from "../utils";

export const stdioTransportSchema = z.object({
  type: z.literal(Transport.STDIO),
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
});

export const remoteTransportSchema = z.object({
  type: z.union([z.literal(Transport.SSE), z.literal(Transport.HTTP)]),
  url: z.string().url(),
  headerName: z.string().optional(),
  bearerToken: z.string().optional(),
});

export const transportSchema = z.union([
  stdioTransportSchema,
  remoteTransportSchema,
]);
