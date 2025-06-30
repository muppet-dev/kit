import type { BaseEnv } from "@/types";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import z from "zod";

const slugValidator = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
});

const router = new Hono<BaseEnv>();

router.get("/", sValidator("param", slugValidator), (c) => {
  const servers = c.get("servers");
  const { slug } = c.req.valid("param");

  const server = servers.find((server) => server.slug === slug);
  if (server == null) {
    return c.notFound();
  }

  return c.json({
    server,
    tools: {
      enabled: 10,
      total: 24,
    },
    prompts: {
      enabled: 4,
      total: 4,
    },
    static_resources: {
      enabled: 2,
      total: 2,
    },
    dynamic_resources: {
      enabled: 0,
      total: 3,
    },
  });
});

router.delete("/:slug", sValidator("param", slugValidator), (c) => {
  const servers = c.get("servers");
  const { slug } = c.req.valid("param");

  const index = servers.findIndex((server) => server.slug === slug);
  if (index === -1) {
    return c.notFound();
  }

  servers.splice(index, 1);

  return c.body(null);
});

export default router;
