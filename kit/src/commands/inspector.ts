import { serve } from "@hono/node-server";
import app from "@muppet-kit/inspector";
import type { InspectorConfig } from "@muppet-kit/shared";
import { loadConfig } from "c12";
import { Command } from "commander";
import { defineInspectorConfig } from "..";

const command = new Command("inspector")
  .description("start the MCP Inspector")
  .action(async () => {
    console.log("Starting the Inspector...");

    // Load the config file
    const { config } = await loadConfig<InspectorConfig>({
      dotenv: true,
      name: "muppet",
    });

    const _config = defineInspectorConfig(config);

    serve({
      // @ts-expect-error
      fetch: app.fetch,
      port: _config.port,
      hostname: _config.host,
    });

    console.log(
      `Inspector is up and running at http://${_config.host}:${_config.port}`,
    );
  });

export default command;
