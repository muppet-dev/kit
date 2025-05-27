import z from "zod";

export const colorThemeValidation = z.object({
  name: z.string().optional(),
  variables: z.string(),
});
