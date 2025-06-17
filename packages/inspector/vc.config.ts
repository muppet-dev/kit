import { builtinModules } from "node:module";
import path from "node:path";
// Vite Cloudflare config
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
  type Plugin,
  type ResolvedConfig,
  type UserConfig,
  defineConfig,
} from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "client")
    return {
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
          "@/client": path.resolve(__dirname, "./src/client"),
        },
      },
    };

  return {
    ssr: {
      external: ["react", "react-dom"],
    },
    environments: {
      ssr: {
        keepProcessEnv: true,
      },
    },
    plugins: [buildServer(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/client": path.resolve(__dirname, "./src/client"),
      },
    },
    build: {
      rollupOptions: {
        external: ["cloudflare:workers"],
      },
    },
  };
});

const buildServer = (): Plugin => {
  const virtualEntryId = "virtual:build-entry-module";
  const resolvedVirtualEntryId = `\0${virtualEntryId}`;
  let config: ResolvedConfig;
  const output = "index.js";

  return {
    name: "@hono/vite-build",
    configResolved: async (resolvedConfig) => {
      config = resolvedConfig;
    },
    resolveId(id) {
      if (id === virtualEntryId) {
        return resolvedVirtualEntryId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualEntryId) {
        return `import { Hono } from "hono";
        import { DurableObject } from "cloudflare:workers";
        import app from "./src/index.ts";
        import config from "./muppet.config";

        export class MuppetInspector extends DurableObject {
          constructor(ctx, env) {
            super(ctx, env);
            this._app = new Hono().use(async (c, next) => {
              c.set("config", config(env));
              await next();
            }).route("/", app)
          }

          async fetch(request) {
            return this._app.fetch(request, this.env);
          }
        }

        export default {
          fetch: (request, env) => {
            const id = env.Inspector.idFromName("main");
            const stub = env.Inspector.get(id);
            return stub.fetch(request);
          }
        }`;
      }
    },
    apply: (_config, { command, mode }) => {
      if (command === "build" && mode !== "client") {
        return true;
      }
      return false;
    },
    config: async (): Promise<UserConfig> => {
      return {
        ssr: {
          external: [],
          noExternal: true,
          target: "webworker",
        },
        build: {
          outDir: "./dist-server",
          emptyOutDir: true,
          minify: true,
          copyPublicDir: false,
          ssr: true,
          rollupOptions: {
            external: [...builtinModules, /^node:/],
            input: virtualEntryId,
            output: {
              entryFileNames: output,
            },
          },
        },
      };
    },
  };
};
