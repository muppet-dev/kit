import path, { normalize } from "node:path";
import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
  defineConfig,
  type Plugin,
  type ResolvedConfig,
  type UserConfig,
} from "vite";
import { builtinModules } from "node:module";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

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
      external: ["react", "react-dom", "@ngrok/ngrok"],
    },
    plugins: [
      buildServer({
        entry: "src/index.ts",
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
            },
          );
          direntPaths.push(...buildOutDirPaths);
        } catch {}

        const uniqueStaticPaths = new Set<string>();

        for (const p of direntPaths) {
          if (p.isDirectory()) {
            uniqueStaticPaths.add(`/${p.name}/*`);
          } else {
            if (p.name === output) {
              return;
            }
            uniqueStaticPaths.add(`/${p.name}`);
          }
        }

        staticPaths.push(...Array.from(uniqueStaticPaths));

        const entry = options.entry;
        const globStr = normalizePaths([entry])
          .map((e) => `'${e}'`)
          .join(",");

        return `import { Hono } from "hono";
        import { serveStatic } from "@hono/node-server/serve-static"

        export default (config) => {
          const mainApp = new Hono()

        ${serveStaticHook("mainApp", {
          filePaths: staticPaths,
        })}

          const modules = import.meta.glob([${globStr}], { import: 'default', eager: true })
      let added = false
      for (const [, app] of Object.entries(modules)) {
        if (app) {
          const _app = new Hono().use(async (c, next) => {
            c.set("config", config);
            await next();
          }).route("/", app);

          mainApp.all('*', (c) => {
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
        throw new Error("Can't import modules from [${globStr}]")
      }

      return mainApp;
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
          outDir: "./dist",
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

const normalizePaths = (paths: string[]) => {
  return paths.map((p) => {
    let normalizedPath = normalize(p).replace(/\\/g, "/");
    if (normalizedPath.startsWith("./")) {
      normalizedPath = normalizedPath.substring(2);
    }
    return `/${normalizedPath}`;
  });
};

type ServeStaticHookOptions = {
  filePaths?: string[];
  root?: string;
};

export const serveStaticHook = (
  appName: string,
  options: ServeStaticHookOptions,
) => {
  let code = "";
  for (const path of options.filePaths ?? []) {
    code += `${appName}.use('${path}', serveStatic({ root: '${options.root ?? "./"}' }))\n`;
  }
  return code;
};
