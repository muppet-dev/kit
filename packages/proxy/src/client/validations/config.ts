import {
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import z from "zod";

const extraPropValidation = z.object({
  name: z.string().optional(),
});

export const configValidation = z.union([
  stdioTransportSchema.merge(extraPropValidation),
  remoteTransportSchema.merge(extraPropValidation),
]);
