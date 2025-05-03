import { Hono } from "hono";

const router = new Hono();

router.get("/config", (c) => {
  return c.json({});
});

router.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default router;
