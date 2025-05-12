import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const router = new Hono().use(
  serveStatic({
    path: "./index.html",
  }),
);

export default router;
