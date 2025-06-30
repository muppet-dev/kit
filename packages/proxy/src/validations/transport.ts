import {
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import z from "zod";

const extraPropValidation = z.object({
  name: z.string().trim(),
});

export const configTransportSchema = z.union([
  stdioTransportSchema.merge(extraPropValidation),
  remoteTransportSchema.merge(extraPropValidation),
]);
