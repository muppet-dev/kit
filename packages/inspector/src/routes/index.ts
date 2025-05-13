import type { EnvWithConfig } from "@/types";
import { defineInspectorConfig } from "@muppet-kit/shared";
import { Hono } from "hono";
import clientRouter from "./client";
import modelRouter from "./models";
import proxyRouter from "./proxy";
import tunnelRouter from "./tunnel";
import utilsRouter from "./utils";

const apiRouter = new Hono<EnvWithConfig>().use(async (c, next) => {
  if (import.meta.env.MODE === "development") {
    const openai = await import("@ai-sdk/openai").then((mod) => mod.openai);

    c.set(
      "config",
      defineInspectorConfig({
        models: [openai("gpt-4.1-nano")],
      }),
    );
  }

  await next();
});

apiRouter.route("/", utilsRouter);
apiRouter.route("/", modelRouter);
apiRouter.route("/tunnel", tunnelRouter);
apiRouter.route("/", proxyRouter);

const router = new Hono();

router.route("/api", apiRouter);

if (import.meta.env.DEV) {
  router.route("/", clientRouter);
}

export default router;
