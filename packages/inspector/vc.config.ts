// Vite Cloudflare config
import { readdirSync } from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import { resolve } from "node:path";
import devServer from "@hono/vite-dev-server";
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
    plugins: [
      buildServer({
        entry: "/src/index.ts",
      }),
      devServer({
        entry: "/src/index.ts",
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

const buildServer = (options: { entry: string }): Plugin => {
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
        const staticPaths: string[] = [];
        const direntPaths = [];
        try {
          const publicDirPaths = readdirSync(
            resolve(config.root, config.publicDir),
            {
              withFileTypes: true,
            },
          );
          direntPaths.push(...publicDirPaths);
          const buildOutDirPaths = readdirSync(
            resolve(config.root, config.build.outDir),
            {
              withFileTypes: true,
              recursive: true,
            },
          );
          direntPaths.push(...buildOutDirPaths);
        } catch {}

        const uniqueStaticPaths = new Set<string>();

        for (const p of direntPaths) {
          if (!p.isDirectory()) {
            if (p.name === output) {
              return;
            }

            const basepath = (p.parentPath ?? p.path).split("dist")[1];

            uniqueStaticPaths.add(
              basepath?.endsWith("assets") ? `/assets/${p.name}` : `/${p.name}`,
            );
          }
        }

        staticPaths.push(...Array.from(uniqueStaticPaths));

        return `import { Hono } from "hono";
        import config from "./muppet.config";

          const mainApp = new Hono()

          const modules = import.meta.glob(['${options.entry}'], { import: 'default', eager: true })
      let added = false
      for (const [, app] of Object.entries(modules)) {
        if (app) {
          const _app = new Hono().use(async (c, next) => {
            c.set("config", config);
            await next();
          }).route("/", app);

          mainApp.all((c) => {
            let executionCtx
            try {
              executionCtx = c.executionCtx
            } catch {}
            return _app.fetch(c.req.raw, c.env, executionCtx)
          })
          mainApp.notFound((c) => {
            let executionCtx
            try {
              executionCtx = c.executionCtx
            } catch {}
            return _app.fetch(c.req.raw, c.env, executionCtx)
          })
          added = true
        }
      }
      if (!added) {
        throw new Error("Can't import modules from '${options.entry}'")
      }

      export default {
        fetch: mainApp.fetch,
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
          emptyOutDir: false,
          minify: true,
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
