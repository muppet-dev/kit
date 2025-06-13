import { inspectorAction } from "@muppet-kit/shared/actions";
import { Option, program } from "commander";
import pkg from "../package.json" with { type: "json" };
import app from "./index.js";

program
  .name("muppet inspector")
  .description("start the MCP Inspector")
  .version(pkg.version)
  .addOption(new Option("-p, --port <port>", "Port to run the inspector on"))
  .addOption(new Option("-h, --host <host>", "Host to run the inspector on"))
  .addOption(new Option("-c, --config <config>", "Path to the config file"))
  .action((options) =>
    inspectorAction({
      options: { version: pkg.version, ...(options ?? {}) },
      // @ts-expect-error The build output is different
      app,
    }),
  )
  .parse();
