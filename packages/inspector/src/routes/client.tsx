import { Hono } from "hono";
import fs from "node:fs";

const router = new Hono().get("/*", async (c) => {
  const html = fs.readFileSync("./index.html", "utf-8");
  return c.html(html);
});

export default router;
