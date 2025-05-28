import z from "zod";

const themeSchema = z.object({
  light: z
    .object({
      "--radius": z.string().describe("Border radius in CSS format"),
      "--background": z.string().max(100),
      "--foreground": z.string().max(100),
      "--card": z.string().max(100),
      "--card-foreground": z.string().max(100),
      "--popover": z.string().max(100),
      "--popover-foreground": z.string().max(100),
      "--primary": z.string().max(100),
      "--primary-foreground": z.string().max(100),
      "--secondary": z.string().max(100),
      "--secondary-foreground": z.string().max(100),
      "--muted": z.string().max(100),
      "--muted-foreground": z.string().max(100),
      "--accent": z.string().max(100),
      "--accent-foreground": z.string().max(100),
      "--destructive": z.string().max(100),
      "--border": z.string().max(100),
      "--input": z.string().max(100),
      "--ring": z.string().max(100),
      "--sidebar": z.string().max(100),
      "--sidebar-foreground": z.string().max(100),
      "--sidebar-accent": z.string().max(100),
      "--sidebar-accent-foreground": z.string().max(100),
      "--sidebar-border": z.string().max(100),
      "--sidebar-ring": z.string().max(100),
      "--warning": z.string().max(100),
      "--info": z.string().max(100),
      "--success": z.string().max(100),
      "--alert": z.string().max(100),
    })
    .partial()
    .optional(),
  dark: z
    .object({
      "--background": z.string().max(100),
      "--foreground": z.string().max(100),
      "--card": z.string().max(100),
      "--card-foreground": z.string().max(100),
      "--popover": z.string().max(100),
      "--popover-foreground": z.string().max(100),
      "--primary": z.string().max(100),
      "--primary-foreground": z.string().max(100),
      "--secondary": z.string().max(100),
      "--secondary-foreground": z.string().max(100),
      "--muted": z.string().max(100),
      "--muted-foreground": z.string().max(100),
      "--accent": z.string().max(100),
      "--accent-foreground": z.string().max(100),
      "--destructive": z.string().max(100),
      "--border": z.string().max(100),
      "--input": z.string().max(100),
      "--ring": z.string().max(100),
      "--sidebar": z.string().max(100),
      "--sidebar-foreground": z.string().max(100),
      "--sidebar-accent": z.string().max(100),
      "--sidebar-accent-foreground": z.string().max(100),
      "--sidebar-border": z.string().max(100),
      "--sidebar-ring": z.string().max(100),
      "--warning": z.string().max(100),
      "--info": z.string().max(100),
      "--success": z.string().max(100),
      "--alert": z.string().max(100),
    })
    .partial()
    .optional(),
});

export const colorThemeValidation = z.object({
  name: z.string().optional(),
  variables: z.string().refine(
    (str) => {
      try {
        const parsed = JSON.parse(str);
        themeSchema.parse(parsed);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid theme JSON.",
    }
  ),
});
