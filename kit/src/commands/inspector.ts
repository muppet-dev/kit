import { serve } from "@hono/node-server";
import { loadConfig } from "c12";
import { Command } from "commander";
import { type ExecutionContext, Hono } from "hono";
import type { InspectorConfig } from "../types";

const command = new Command("inspector")
  .description("start the MCP Inspector")
  .action(async () => {
    console.log("Starting the Inspector...");

    // Load the config file
    const { config } = await loadConfig<InspectorConfig>({
      dotenv: true,
      name: "muppet",
    });

    // TODO: get this from @muppet-kit/inspector
    const app = new Hono();

    const mainApp = new Hono<{ Variables: { config: InspectorConfig } }>()
      .use(async (c, next) => {
        c.set("config", config);
        await next();
      })
      .all("*", (c) => {
        let executionCtx: ExecutionContext | undefined;
        try {
          executionCtx = c.executionCtx;
        } catch {}
        return app.fetch(c.req.raw, c.env, executionCtx);
      })
      .notFound((c) => {
        let executionCtx: ExecutionContext | undefined;
        try {
          executionCtx = c.executionCtx;
        } catch {}
        return app.fetch(c.req.raw, c.env, executionCtx);
      });

    serve({
      fetch: mainApp.fetch,
      port: config.port,
      hostname: config.host,
    });

    console.log(
      `Inspector is up and running at http://${config.host}:${config.port}`,
    );
  });

export default command;
