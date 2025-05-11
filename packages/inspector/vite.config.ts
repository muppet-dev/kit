import path from "node:path";
import build from "@hono/vite-build/node";
import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client")
    return {
      plugins: [react(), tailwindcss()],
      build: {
        rollupOptions: {
          input: "./src/client/main.tsx",
          output: {
            entryFileNames: "static/client.js",
            manualChunks: undefined,
          },
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
          "@/client": path.resolve(__dirname, "./src/client"),
        },
      },
    };

  return {
    ssr: {
      external: ["react", "react-dom", "@ngrok/ngrok"],
    },
    plugins: [
      build({
        entry: "src/index.ts",
        entryContentAfterHooks: [],
      }),
      devServer({
        entry: "src/index.ts",
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/client": path.resolve(__dirname, "./src/client"),
      },
    },
  };
});
