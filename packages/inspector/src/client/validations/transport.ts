import {
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import z from "zod";

const extendedProps = {
  name: z.string().optional(),
};

export const transportSchema = z.union([
  stdioTransportSchema.extend(extendedProps),
  remoteTransportSchema.extend(extendedProps),
]);
