import { Hono } from "hono";
import statsRouter from "./stats";
import serversRouter from "./servers";
import pkg from "../../package.json";
import clientRouter from "./client";

const apiRouter = new Hono();

apiRouter.route("/stats", statsRouter);
apiRouter.route("/servers", serversRouter);

const router = new Hono();

router.route("/api", apiRouter);
router.get("/version", (c) => c.text(pkg.version));

if (import.meta.env.DEV) {
  router.route("/", clientRouter);
}

export default router;
