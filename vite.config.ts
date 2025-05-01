import path from "node:path";
import build from "@hono/vite-build/node";
import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client")
    return {
      ssr: {
        external: ["react", "react-dom"],
      },
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      build: {
        rollupOptions: {
          input: "./src/main.tsx",
          output: {
            entryFileNames: "static/client.js",
          },
        },
      },
    };

  return {
    ssr: {
      external: ["react", "react-dom"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      tailwindcss(),
      build({
        entry: "src/index.ts",
      }),
      devServer({
        entry: "src/index.ts",
      }),
    ],
  };
});
