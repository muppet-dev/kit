import app from "@muppet-kit/inspector";
import { inspectorAction } from "@muppet-kit/shared/actions";
import { Command, Option } from "commander";

const command = new Command("inspector")
  .description("start the MCP Inspector")
  .addOption(new Option("-p, --port <port>", "Port to run the inspector on"))
  .addOption(new Option("-h, --host <host>", "Host to run the inspector on"))
  .addOption(new Option("-c, --config <config>", "Path to the config file"))
  .action((options) =>
    inspectorAction({
      options,
      // @ts-expect-error The build output is different
      app,
    }),
  );

export default command;
