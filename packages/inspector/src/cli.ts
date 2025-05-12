import { serve } from "@hono/node-server";
import {
  type InspectorConfig,
  defineInspectorConfig,
} from "@muppet-kit/shared";
import { loadConfig } from "c12";
import { Option, program } from "commander";
import pkg from "../package.json" assert { type: "json" };
import app from "./index.js";

program
  .name("muppet inspector")
  .description("start the MCP Inspector")
  .version(pkg.version)
  .addOption(new Option("-p, --port <port>", "Port to run the inspector on"))
  .addOption(new Option("-h, --host <host>", "Host to run the inspector on"))
  .addOption(new Option("-c, --config <config>", "Path to the config file"))
  .action(async (options) => {
    console.log("Starting the Inspector...");

    // Load the config file
    const { config } = await loadConfig<InspectorConfig>({
      dotenv: true,
      ...(options?.config
        ? {
            configFile: options?.config,
          }
        : { name: "muppet" }),
    });

    const _config = defineInspectorConfig(config);

    serve({
      fetch: app.fetch,
      port: options?.port ?? _config.port,
      hostname: options?.host ?? _config.host,
    });

    console.log(
      `Inspector is up and running at http://${_config.host}:${_config.port}`,
    );
  })
  .parse();
