import z from "zod";

const cssColorVariableSchema = z.union([
  z.string().describe("CSS color variable"),
  z.string().length(7).startsWith("#").describe("Color in hex format"),
]);

export const customThemeSchema = z
  .object({
    light: z
      .object({
        "--radius": z.string().describe("Border radius in CSS format"),
        "--background": cssColorVariableSchema,
        "--foreground": cssColorVariableSchema,
        "--card": cssColorVariableSchema,
        "--card-foreground": cssColorVariableSchema,
        "--popover": cssColorVariableSchema,
        "--popover-foreground": cssColorVariableSchema,
        "--primary": cssColorVariableSchema,
        "--primary-foreground": cssColorVariableSchema,
        "--secondary": cssColorVariableSchema,
        "--secondary-foreground": cssColorVariableSchema,
        "--muted": cssColorVariableSchema,
        "--muted-foreground": cssColorVariableSchema,
        "--accent": cssColorVariableSchema,
        "--accent-foreground": cssColorVariableSchema,
        "--destructive": cssColorVariableSchema,
        "--border": cssColorVariableSchema,
        "--input": cssColorVariableSchema,
        "--ring": cssColorVariableSchema,
        "--sidebar": cssColorVariableSchema,
        "--sidebar-foreground": cssColorVariableSchema,
        "--sidebar-accent": cssColorVariableSchema,
        "--sidebar-accent-foreground": cssColorVariableSchema,
        "--sidebar-border": cssColorVariableSchema,
        "--sidebar-ring": cssColorVariableSchema,
        "--warning": cssColorVariableSchema,
        "--info": cssColorVariableSchema,
        "--success": cssColorVariableSchema,
        "--alert": cssColorVariableSchema,
      })
      .partial(),
    dark: z
      .object({
        "--background": cssColorVariableSchema,
        "--foreground": cssColorVariableSchema,
        "--card": cssColorVariableSchema,
        "--card-foreground": cssColorVariableSchema,
        "--popover": cssColorVariableSchema,
        "--popover-foreground": cssColorVariableSchema,
        "--primary": cssColorVariableSchema,
        "--primary-foreground": cssColorVariableSchema,
        "--secondary": cssColorVariableSchema,
        "--secondary-foreground": cssColorVariableSchema,
        "--muted": cssColorVariableSchema,
        "--muted-foreground": cssColorVariableSchema,
        "--accent": cssColorVariableSchema,
        "--accent-foreground": cssColorVariableSchema,
        "--destructive": cssColorVariableSchema,
        "--border": cssColorVariableSchema,
        "--input": cssColorVariableSchema,
        "--ring": cssColorVariableSchema,
        "--sidebar": cssColorVariableSchema,
        "--sidebar-foreground": cssColorVariableSchema,
        "--sidebar-accent": cssColorVariableSchema,
        "--sidebar-accent-foreground": cssColorVariableSchema,
        "--sidebar-border": cssColorVariableSchema,
        "--sidebar-ring": cssColorVariableSchema,
        "--warning": cssColorVariableSchema,
        "--info": cssColorVariableSchema,
        "--success": cssColorVariableSchema,
        "--alert": cssColorVariableSchema,
      })
      .partial(),
  })
  .partial();
