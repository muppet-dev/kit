import { Command, Option } from "commander";
import { execa } from "execa";

const command = new Command("inspector")
  .description("start the MCP Inspector")
  .addOption(
    new Option("-p, --port <port>", "Port to run the inspector on").default(
      "3000",
    ),
  )
  .addOption(
    new Option("-h, --host <host>", "Host to run the inspector on").default(
      "localhost",
    ),
  )
  .addOption(
    new Option("-c, --config <config>", "Path to the config file").default(
      "muppet.config",
    ),
  )
  .action(async (options) => {
    const _args = Object.entries(options).map(
      ([key, value]) => `--${key} ${value}`,
    );
    await execa("npx", ["@muppet-kit/inspector@latest", "-y", ..._args]);
  });

export default command;
