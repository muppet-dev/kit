import { Command } from "commander";
import { execa } from "execa";

const command = new Command("inspector")
  .description("start the MCP Inspector")
  .action(async () => {
    await execa("npx", ["@muppet-kit/inspector@latest", "-y"]);
  });

export default command;
