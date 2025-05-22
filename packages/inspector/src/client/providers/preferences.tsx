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

export function PreferencesProvider({ children }: PropsWithChildren) {
  const values = usePreferencesManager();

  return (
    <PreferencesContext.Provider value={values}>
      {children}
    </PreferencesContext.Provider>
  );
}

function usePreferencesManager() {
  const [preferences, setPreferences] = useLocalStorage<{
    toast: ToastPosition;
    theme: Theme;
  }>("muppet-preferences", {
    toast: "bottom-right",
    theme: Theme.SYSTEM,
  });
  const [resolvedTheme, setResolvedTheme] = useState<Theme.LIGHT | Theme.DARK>(
    Theme.LIGHT
  );

  const { theme, toast } = preferences;

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

  return {
    toastPosition: toast,
    setToast,
    setTheme,
    resolvedTheme,
    theme,
  };
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context)
    throw new Error("Missing PreferencesContext.Provider in the tree!");

  return context;
};
