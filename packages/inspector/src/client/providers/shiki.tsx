"use client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import {
  createSingletonShorthands,
  createdBundledHighlighter,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const BundledLanguages = {
  json: () => import("@shikijs/langs/json"),
};

const BundledThemes = {
  "github-light-default": () => import("@shikijs/themes/github-light-default"),
  "github-dark-default": () => import("@shikijs/themes/github-dark-default"),
};

const ShikiContext = createContext<ReturnType<typeof useHighlighter> | null>(
  null,
);

export function ShikiProvider({ children }: PropsWithChildren) {
  const value = useHighlighter();
  return (
    <ShikiContext.Provider value={value}>{children}</ShikiContext.Provider>
  );
}

function useHighlighter() {
  const highlighter = useMemo(() => {
    const createHighlighter = /* @__PURE__ */ createdBundledHighlighter({
      langs: BundledLanguages,
      themes: BundledThemes,
      engine: () => createJavaScriptRegexEngine(),
    });

    return createSingletonShorthands(createHighlighter);
  }, []);

  return highlighter;
}

export function useShiki() {
  const context = useContext(ShikiContext);

  return context;
}
