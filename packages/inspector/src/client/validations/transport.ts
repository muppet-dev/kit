import {
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import z from "zod";
import { generateName } from "../lib/utils";

export const SUBMIT_BUTTON_KEY = "__submit_btn";

export enum DocumentSubmitType {
  CONNECT = "connect",
  SAVE_AND_CONNECT = "save and connect",
}

const extraPropValidation = z.object({
  name: z.string().default(generateName).optional(),
  [SUBMIT_BUTTON_KEY]: z.nativeEnum(DocumentSubmitType).optional(),
});

export const configTransportSchema = z.union([
  stdioTransportSchema.merge(extraPropValidation),
  remoteTransportSchema.merge(extraPropValidation),
]);
