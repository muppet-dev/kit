import { useLocalStorage } from "@uidotdev/usehooks";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ToastPosition } from "react-hot-toast";
import { SortingEnum } from "../lib/utils";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

type PreferencesContextType = ReturnType<typeof usePreferencesManager>;

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const values = usePreferencesManager();

  return (
    <PreferencesContext.Provider value={values}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const DEFAULT_THEME = `{
  "light": {
    "--radius": "-4px",
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": "oklch(0.205 0 0)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": "oklch(0.708 0 0)",
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",
    "--warning": "oklch(76.9% 0.188 70.08)",
    "--info": "oklch(62.3% 0.214 259.815)",
    "--success": "oklch(62.7% 0.194 149.214)",
    "--alert": "oklch(70.5% 0.213 47.604)"
  },
  "dark": {
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": "oklch(0.922 0 0)",
    "--primary-foreground": "oklch(0.205 0 0)",
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": "oklch(0.269 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.556 0 0)",
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.556 0 0)",
    "--warning": "oklch(87.9% 0.169 91.605)",
    "--info": "oklch(88.2% 0.059 254.128)",
    "--success": "oklch(92.5% 0.084 155.995)",
    "--alert": "oklch(83.7% 0.128 66.29)"
  }
}`;

function usePreferencesManager() {
  const [preferences, setPreferences] = useLocalStorage<{
    toast: ToastPosition;
    theme: Theme;
    color_theme: string;
    saved_config_sort: SortingEnum;
  }>("muppet-preferences", {
    toast: "bottom-right",
    theme: Theme.SYSTEM,
    color_theme: "default",
    saved_config_sort: SortingEnum.DESCENDING,
  });
  const [colorTheme, setColorTheme] = useLocalStorage<Record<string, string>>(
    "muppet-color-theme",
    {
      default: DEFAULT_THEME,
    },
  );

  const [resolvedTheme, setResolvedTheme] = useState<Theme.LIGHT | Theme.DARK>(
    Theme.LIGHT,
  );

  const {
    theme,
    toast,
    color_theme,
    saved_config_sort = SortingEnum.DESCENDING,
  } = preferences;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const systemTheme = media.matches ? Theme.DARK : Theme.LIGHT;

    const updateResolvedTheme = () => {
      const newResolvedTheme = theme === "system" ? systemTheme : theme;
      setResolvedTheme(newResolvedTheme);
      const root = window.document.documentElement;
      root.classList.remove(Theme.LIGHT, Theme.DARK);
      root.classList.add(newResolvedTheme);
    };

    updateResolvedTheme();

    if (theme === "system") {
      media.addEventListener("change", updateResolvedTheme);
      return () => media.removeEventListener("change", updateResolvedTheme);
    }
  }, [theme]);

  type VariablesType = {
    light: Record<string, string>;
    dark: Record<string, string>;
  };

  useEffect(() => {
    const currentColorThemeVariable =
      colorTheme[preferences.color_theme] ?? colorTheme.default;

    const variables = colorTheme
      ? (JSON.parse(currentColorThemeVariable) as VariablesType)
      : { light: {}, dark: {} };
    const isDarkMode = resolvedTheme === Theme.DARK;

    const defaultParseTheme = JSON.parse(DEFAULT_THEME) as VariablesType;

    const themeVariables = isDarkMode
      ? {
          ...defaultParseTheme.dark,
          ...variables.dark,
          "--radius": variables.light["--radius"],
        }
      : { ...defaultParseTheme.light, ...variables.light };

    for (const [key, value] of Object.entries(themeVariables)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [preferences.color_theme, resolvedTheme, colorTheme]);

  const setTheme = (newTheme: Theme) =>
    setPreferences((prev) => ({
      ...prev,
      theme: newTheme,
    }));

  const setToast = (newToastPosition: ToastPosition) =>
    setPreferences((prev) => ({
      ...prev,
      toast: newToastPosition,
    }));

  const setCurrentColorTheme = (newColorTheme: string) => {
    setPreferences((prev) => ({
      ...prev,
      color_theme: newColorTheme,
    }));
  };

  const toggleConfigurationsSort = () => {
    setPreferences((prev) => ({
      ...prev,
      saved_config_sort:
        prev.saved_config_sort === SortingEnum.ASCENDING
          ? SortingEnum.DESCENDING
          : SortingEnum.ASCENDING,
    }));
  };

  return {
    toastPosition: toast,
    setToast,
    setTheme,
    resolvedTheme,
    theme,
    colorTheme,
    setColorTheme,
    setCurrentColorTheme,
    currentColorTheme: color_theme,
    configurationsSort: saved_config_sort,
    toggleConfigurationsSort,
  };
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context)
    throw new Error("Missing PreferencesContext.Provider in the tree!");

  return context;
};
