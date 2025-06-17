import type { BaseEnv } from "@/types";
import { sValidator } from "@hono/standard-validator";
import {
  Transport,
  remoteTransportSchema,
  stdioTransportSchema,
} from "@muppet-kit/shared";
import slugify from "@sindresorhus/slugify";
import { Hono } from "hono";
import z from "zod";

const router = new Hono<BaseEnv>();

router.get("/", (c) => {
  const servers = c.get("servers").map((server) => {
    const tmp = {
      id: server.id,
      name: server.name,
      status: server.status,
    };

    if (server.type === Transport.STDIO) {
      return {
        ...tmp,
        transport: Transport.STDIO,
        command: server.command,
        args: server.args,
      };
    }

    return {
      ...tmp,
      transport: server.type,
      url: server.url,
    };
  });

  return c.json(servers);
});

const extraPropValidation = z.object({
  name: z.string().trim(),
});

export const configTransportSchema = z.union([
  stdioTransportSchema.merge(extraPropValidation),
  remoteTransportSchema.merge(extraPropValidation),
]);

router.post("/", sValidator("json", configTransportSchema), (c) => {
  const server = c.req.valid("json");
  const servers = c.get("servers");
  const id = (servers.length > 0 ? servers[servers.length - 1].id : 0) + 1;

  servers.push({
    ...server,
    id,
    name: slugify(server.name),
    status: "online",
  });

  return c.json({ id });
});

const idValidator = z.object({
  id: z.coerce.number().int().positive(),
});

router.get("/:id", sValidator("param", idValidator), (c) => {
  const servers = c.get("servers");
  const { id } = c.req.valid("param");

  const index = servers.findIndex((server) => server.id === id);
  if (index === -1) {
    return c.notFound();
  }

  const server = servers[index];

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

router.delete("/:id", sValidator("param", idValidator), (c) => {
  const servers = c.get("servers");
  const { id } = c.req.valid("param");

  const index = servers.findIndex((server) => server.id === id);
  if (index === -1) {
    return c.notFound();
  }

  servers.splice(index, 1);

  return c.body(null);
});

export default router;
