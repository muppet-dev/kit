import type { BaseEnv } from "@/types";
import { sValidator } from "@hono/standard-validator";
import { Transport } from "@muppet-kit/shared";
import { configTransportSchema } from "@/validations";
import slugify from "@sindresorhus/slugify";
import { Hono } from "hono";
import serverSlugRouter from "./[slug]";
import { nanoid } from "nanoid";

const router = new Hono<BaseEnv>();

router.get("/", (c) => {
  const servers = c.get("servers").map((server) => {
    const tmp = {
      name: server.name,
      slug: server.slug,
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

router.post("/", sValidator("json", configTransportSchema), (c) => {
  const server = c.req.valid("json");
  const servers = c.get("servers");
  const slug = nanoid();

  servers.push({
    ...server,
    slug,
    name: slugify(server.name),
  });

  return c.json({ slug }, 201);
});

router.route("/", serverSlugRouter);

export default router;
