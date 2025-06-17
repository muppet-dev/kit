import {
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import z from "zod";

export const SUBMIT_BUTTON_KEY = "__submit_btn";

export enum DocumentSubmitType {
  CONNECT = "connect",
  SAVE_AND_CONNECT = "save and connect",
}

const extraPropValidation = {
  name: z.string().optional(),
  request_timeout: z.number().optional(),
  progress: z.boolean().optional(),
  total_timeout: z.number().optional(),
  proxy: z.string().optional(),
  [SUBMIT_BUTTON_KEY]: z.nativeEnum(DocumentSubmitType).optional(),
};

export const configTransportSchema = z.union([
  stdioTransportSchema.extend(extraPropValidation),
  remoteTransportSchema.extend(extraPropValidation),
]);
