import type { BaseEnv } from "@/types";
import { Hono } from "hono";
import pkg from "../../package.json";
import clientRouter from "./client";
import serversRouter from "./servers";
import statsRouter from "./stats";

const servers: BaseEnv["Variables"]["servers"] = [];

const apiRouter = new Hono<BaseEnv>().use(async (c, next) => {
  c.set("servers", servers);

  await next();
});

apiRouter.route("/stats", statsRouter);
apiRouter.route("/servers", serversRouter);

const router = new Hono();

router.route("/api", apiRouter);
router.get("/version", (c) => c.text(pkg.version));

if (import.meta.env.DEV) {
  router.route("/", clientRouter);
}

export default router;
