import { Transport } from "@muppet-kit/shared";
import { Hono } from "hono";

const router = new Hono();

router.get("/", (c) => {
  return c.json([
    {
      id: 1,
      name: "Server 1",
      status: "online",
      transport: Transport.HTTP,
      url: "http://example.com",
    },
    {
      id: 1,
      name: "Server 1",
      status: "online",
      transport: Transport.STDIO,
      command: "node",
      args: ["--version"],
    },
    {
      id: 2,
      name: "Server 2",
      status: "offline",
      transport: Transport.SSE,
      url: "http://example.com/sse",
    },
    {
      id: 3,
      name: "Server 3",
      status: "degraded",
      transport: Transport.HTTP,
      url: "http://something.com",
    },
  ]);
});

router.post("/", (c) => {
  return c.json({ id: 4 });
});

router.get("/:id", (c) => {
  return c.json({});
});

router.put("/:id", (c) => {
  return c.json({});
});

router.delete("/:id", (c) => {
  return c.body(null);
});

export default router;
