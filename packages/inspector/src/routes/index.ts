import type { EnvWithConfig } from "@/types";
import { Hono } from "hono";
import clientRouter from "./client";
import modelRouter from "./models";
import proxyRouter from "./proxy";
import tunnelRouter from "./tunnel";
import scanningRouter from "./scanning";
import utilsRouter from "./utils";
import pkg from "../../package.json";

const apiRouter = new Hono<EnvWithConfig>().use(async (c, next) => {
  if (import.meta.env.MODE === "development") {
    const config = await import("../../muppet.config").then(
      (mod) => mod.default,
    );

    c.set("config", config);
  }

  await next();
});

apiRouter.route("/", utilsRouter);
apiRouter.route("/", modelRouter);
apiRouter.route("/tunnel", tunnelRouter);
apiRouter.route("/", proxyRouter);
apiRouter.route("/scanning", scanningRouter);

const router = new Hono();

router.route("/api", apiRouter);
router.get("/version", (c) => c.text(pkg.version));

if (import.meta.env.DEV) {
  router.route("/", clientRouter);
}

export default router;
