import { program } from "commander";
import pkg from "../package.json" with { type: "json" };

program
  .name("muppet proxy")
  .description("start the MCP Proxy server")
  .version(pkg.version)
  .action((options) => {})
  .parse();
