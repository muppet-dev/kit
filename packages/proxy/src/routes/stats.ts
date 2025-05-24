import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) => {
  return c.json({
    servers: 12,
    tools: 100,
    prompts: 10,
    resources: 0,
  });
});

export default router;
