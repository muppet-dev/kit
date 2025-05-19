import { useLocalStorage } from "@uidotdev/usehooks";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

type ThemeProviderProps = {
  defaultTheme?: Theme;
  storageKey?: string;
};

const ThemeProviderContext = createContext<ReturnType<
  typeof useThemeManager
> | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = Theme.SYSTEM,
  storageKey = "muppet-theme",
  ...props
}: PropsWithChildren<ThemeProviderProps>) {
  const value = useThemeManager({ storageKey, defaultTheme });

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

function useThemeManager({
  storageKey,
  defaultTheme,
}: Required<ThemeProviderProps>) {
  const [theme, setThemeState] = useLocalStorage<Theme>(
    storageKey,
    defaultTheme
  );
  const [resolvedTheme, setResolvedTheme] = useState<Theme.LIGHT | Theme.DARK>(
    Theme.LIGHT
  );

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

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  return {
    theme: resolvedTheme,
    setTheme,
    themeStorageKey: storageKey,
  };
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) throw new Error("Missing ThemeContext.Provider in the tree!");

  return context;
};
