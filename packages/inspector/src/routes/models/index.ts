import type { EnvWithConfig } from "@/types/index.js";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { stream } from "hono/streaming";

const router = new Hono<EnvWithConfig>();

router.get("/", (c) => {
  return c.json([]);
});

router.post(
  "/:modelId/chat",
  sValidator(
    "json",
    z.object({
      messages: z.array(z.any()),
    }),
  ),
  async (c) => {
    const { modelId } = c.req.param();
    const { messages } = c.req.valid("json");

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    return stream(c, (stream) => stream.pipe(result.toDataStream()));
  },
);

export default router;
