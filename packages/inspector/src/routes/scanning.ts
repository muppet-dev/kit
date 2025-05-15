import { sValidator } from "@hono/standard-validator";
import { _generateModelKey } from "@muppet-kit/shared";
import { Hono } from "hono";
import z from "zod";

const router = new Hono();

const schema = z.object({
  type: z.enum(["tool", "resource", "prompt"]),
  name: z.string(),
  description: z.string().optional(),
});

router.post("/", sValidator("json", z.array(schema)), async (c) => {
  const entries = c.req.valid("json");

  const messages = entries.map((entry) => ({
    role: "system",
    content: `${capitalizeFirstLetter[entry.type]} Name:${entry.name}\n${
      capitalizeFirstLetter[entry.type]
    } Description:${entry.description}`,
  }));

  const response = await fetch(
    "https://mcp.invariantlabs.ai/api/v1/public/mcp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Verification API error: ${response.status} - ${await response.text()}`
    );
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Verification API error: ${data.error_message}`);
  }

  const newEntries: (z.infer<typeof schema> & { errors?: string[] })[] = [];

  for (const error of data.errors ?? []) {
    const index = transformKey(error.key);

    if (index !== undefined) {
      newEntries.push({
        type: entries[index].type,
        name: entries[index].name,
        description: entries[index].description,
        errors: error.args,
      });
    }
  }

  return c.json(newEntries);
});

export default router;

const capitalizeFirstLetter = {
  tool: "Tool",
  resource: "Resource",
  prompt: "Prompt",
};

function transformKey(key: string) {
  // Replace all parentheses with square brackets
  const transformed = key.replaceAll(/\(/g, "[").replaceAll(/\)/g, "]");

  // Create a function that will safely evaluate the string as array access
  const keyFn = new Function(`return ${transformed}[1][0]`);

  // Execute the function
  try {
    return keyFn();
  } catch (error) {
    console.error("Error accessing nested value:", error);
    return undefined;
  }
}
