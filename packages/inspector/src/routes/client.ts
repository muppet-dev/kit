import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const router = new Hono().use(
  serveStatic({
    path: "./index.html",
  }),
);

export default router;
