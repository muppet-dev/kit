import { program } from "commander";
import { serve } from "@hono/node-server";
import { loadConfig } from "c12";
import pkg from "../package.json" assert { type: "json" };
import {
  type InspectorConfig,
  defineInspectorConfig,
} from "@muppet-kit/shared";
import app from "./index.js";

program
  .name("muppet inspector")
  .description("start the MCP Inspector")
  .version(pkg.version)
  .action(async () => {
    console.log("Starting the Inspector...");

    // Load the config file
    const { config } = await loadConfig<InspectorConfig>({
      dotenv: true,
      name: "muppet",
    });

    const _config = defineInspectorConfig(config);

    serve({
      fetch: app.fetch,
      port: _config.port,
      hostname: _config.host,
    });

    console.log(
      `Inspector is up and running at http://${_config.host}:${_config.port}`,
    );
  })
  .parse();
