import { customThemeSchema } from "@/validations";
import z from "zod";

export const colorThemeValidation = z.object({
  name: z.string().optional(),
  variables: z.string().refine(
    (str) => {
      try {
        const parsed = JSON.parse(str);
        customThemeSchema.parse(parsed);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid theme JSON.",
    },
  ),
});
