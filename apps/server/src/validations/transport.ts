import z from "zod";
import { parse as shellParseArgs } from "shell-quote";

export const transportSchema = z.union([
  z.object({
    transportType: z.literal("stdio"),
    command: z.string(),
    args: z
      .string()
      .optional()
      .transform((val) => shellParseArgs(val ?? "")),
    env: z
      .string()
      .optional()
      .transform((val) => (val ? JSON.parse(val) : {})),
  }),
  z.object({
    transportType: z.literal("sse"),
    url: z.string().url(),
  }),
]);

export const transportHeaderSchema = z.object({
  authorization: z.string().optional(),
});
