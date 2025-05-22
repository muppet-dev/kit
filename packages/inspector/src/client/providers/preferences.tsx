import { useLocalStorage } from "@uidotdev/usehooks";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { ToastPosition } from "react-hot-toast";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system",
}

type PreferencesContextType = ReturnType<typeof usePreferencesManager>;

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export type PreferencesProviderProps = {
  defaultTheme?: Theme;
  storageKey?: string;
};

export function PreferencesProvider({
  children,
  defaultTheme = Theme.SYSTEM,
  storageKey = "muppet-theme",
}: PropsWithChildren<PreferencesProviderProps>) {
  const values = usePreferencesManager({ storageKey, defaultTheme });

  return (
    <PreferencesContext.Provider value={values}>
      {children}
    </PreferencesContext.Provider>
  );
}

function usePreferencesManager({
  storageKey,
  defaultTheme,
}: Required<PreferencesProviderProps>) {
  const [toastPosition, setToastPosition] = useLocalStorage<ToastPosition>(
    "toast-preferences",
    "bottom-right"
  );
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

  const setToast = (newToastPosition: ToastPosition) =>
    setToastPosition(newToastPosition);

  return {
    toastPosition,
    setToast,
    setTheme,
    theme: resolvedTheme,
    themeStorageKey: storageKey,
  };
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context)
    throw new Error("Missing PreferencesContext.Provider in the tree!");

  return context;
};
