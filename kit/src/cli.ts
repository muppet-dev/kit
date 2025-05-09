import { program } from "commander";
import pkg from "../package.json" assert { type: "json" };
import inspectorCommand from "./commands/inspector.js";

program
  .name("muppet kit")
  .description("devtools for MCPs")
  .version(pkg.version)
  .addCommand(inspectorCommand)
  .parse();
