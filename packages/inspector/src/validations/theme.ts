import z from "zod";

const hexColorSchema = z
  .string()
  .length(7)
  .startsWith("#")
  .describe("Color in hex format");

export const customThemeSchema = z
  .object({
    light: z
      .object({
        "--radius": z.string().describe("Border radius in CSS format"),
        "--background": hexColorSchema,
        "--foreground": hexColorSchema,
        "--card": hexColorSchema,
        "--card-foreground": hexColorSchema,
        "--popover": hexColorSchema,
        "--popover-foreground": hexColorSchema,
        "--primary": hexColorSchema,
        "--primary-foreground": hexColorSchema,
        "--secondary": hexColorSchema,
        "--secondary-foreground": hexColorSchema,
        "--muted": hexColorSchema,
        "--muted-foreground": hexColorSchema,
        "--accent": hexColorSchema,
        "--accent-foreground": hexColorSchema,
        "--destructive": hexColorSchema,
        "--border": hexColorSchema,
        "--input": hexColorSchema,
        "--ring": hexColorSchema,
        "--sidebar": hexColorSchema,
        "--sidebar-foreground": hexColorSchema,
        "--sidebar-accent": hexColorSchema,
        "--sidebar-accent-foreground": hexColorSchema,
        "--sidebar-border": hexColorSchema,
        "--sidebar-ring": hexColorSchema,
        "--warning": hexColorSchema,
        "--info": hexColorSchema,
        "--success": hexColorSchema,
        "--alert": hexColorSchema,
      })
      .partial(),
    dark: z
      .object({
        "--background": hexColorSchema,
        "--foreground": hexColorSchema,
        "--card": hexColorSchema,
        "--card-foreground": hexColorSchema,
        "--popover": hexColorSchema,
        "--popover-foreground": hexColorSchema,
        "--primary": hexColorSchema,
        "--primary-foreground": hexColorSchema,
        "--secondary": hexColorSchema,
        "--secondary-foreground": hexColorSchema,
        "--muted": hexColorSchema,
        "--muted-foreground": hexColorSchema,
        "--accent": hexColorSchema,
        "--accent-foreground": hexColorSchema,
        "--destructive": hexColorSchema,
        "--border": hexColorSchema,
        "--input": hexColorSchema,
        "--ring": hexColorSchema,
        "--sidebar": hexColorSchema,
        "--sidebar-foreground": hexColorSchema,
        "--sidebar-accent": hexColorSchema,
        "--sidebar-accent-foreground": hexColorSchema,
        "--sidebar-border": hexColorSchema,
        "--sidebar-ring": hexColorSchema,
        "--warning": hexColorSchema,
        "--info": hexColorSchema,
        "--success": hexColorSchema,
        "--alert": hexColorSchema,
      })
      .partial(),
  })
  .partial();
