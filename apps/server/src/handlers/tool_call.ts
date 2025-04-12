import { getContext } from "hono/context-storage";
import type { InspectorEnv } from "../types";

export async function toolCall() {
  console.log("🔍 Discovering and calling MCP tools...");

  try {
    const client = getContext<InspectorEnv>().get("client");
    const toolsResult = await client.listTools();

    console.log(`🛠️ Found ${toolsResult.tools.length} tools`);

    for (const tool of toolsResult.tools) {
      console.log(`🛠️ Processing tool: ${tool.name}`);

      //   try {

      //   } catch (err) {
      //     console.error(`Error calling tool ${tool.name}:`, error);
      //   }
    }
  } catch (err) {
    console.error("Error during tool discovery:", err);
  }

  return {};
}
