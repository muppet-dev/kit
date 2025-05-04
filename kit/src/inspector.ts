import { Command } from "commander";
import { loadConfig } from "c12";

const command = new Command("inspector")
  .description("start the MCP Inspector")
  .action(async () => {
    // Load the config file
    const { config } = await loadConfig({
      dotenv: true,
      name: "muppet",
    });
  });

export default command;
