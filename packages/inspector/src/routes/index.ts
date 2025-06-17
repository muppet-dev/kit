import type { EnvWithConfig } from "@/types";
import { Hono } from "hono";
import clientRouter from "./client";
import modelRouter from "./models";
import proxyRouter from "./proxy";
import tunnelRouter from "./tunnel";
import scanningRouter from "./scanning";
import utilsRouter from "./utils";
import pkg from "../../package.json";
import pino from "pino";
import { describeRoute, generateSpecs } from "hono-openapi";

const apiRouter = new Hono();

apiRouter.route("/", utilsRouter);
apiRouter.route("/", modelRouter);
apiRouter.route("/tunnel", tunnelRouter);
apiRouter.route("/", proxyRouter);
apiRouter.route("/scanning", scanningRouter);

const router = new Hono<EnvWithConfig>().use(async (c, next) => {
  if (import.meta.env.DEV) {
    const config = await import("../../muppet.config").then(
      (mod) => mod.default,
    );

    c.set("config", config(process.env));
  }

  c.set(
    "logger",
    c.get("config").logger ||
      pino({
        level: import.meta.env.DEV ? "debug" : undefined,
        transport: {
          target: "pino-pretty",
        },
      }),
  );

  await next();
});

router.route("/api", apiRouter);
router.get(
  "/version",
  describeRoute({
    description: "Get the current version of the Muppet Inspector",
    responses: {
      200: {
        description: "Version retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                version: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  (c) => c.text(pkg.version),
);

// OpenAPI documentation
let specs: Awaited<ReturnType<typeof generateSpecs>> | undefined;
router.get("/openapi.json", async (c) => {
  const inspectorConfig = c.get("config");

  if (!inspectorConfig.enableOpenAPI) {
    return c.text("OpenAPI documentation is disabled", 404);
  }

  if (!specs) {
    const { host, port } = inspectorConfig;
    specs = await generateSpecs(
      router,
      {
        documentation: {
          info: {
            title: "Muppet Inspector API",
            version: pkg.version,
            description:
              "Muppet Inspector is a tool for inspecting and debugging MCP (Model Context Protocol) Servers.",
          },
          servers: [
            {
              url: `${host}:${port}`,
              description: "API Server",
            },
          ],
        },
      },
      {
        version: "3.1.0",
        components: {},
      },
      c,
    );
  }

  return c.json(specs);
});

if (import.meta.env.DEV) {
  router.route("/", clientRouter);
}

export default router;
