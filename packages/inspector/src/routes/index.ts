import { Hono } from "hono";
import utilsRouter from "./utils";
import proxyRouter from "./proxy";
import tunnelRouter from "./tunnel";
import modelRouter from "./models";
import generateRouter from "./generate";
import analyseRouter from "./analyse";
import clientRouter from "./client";

const apiRouter = new Hono();

apiRouter.route("/", utilsRouter);
apiRouter.route("/", modelRouter);
apiRouter.route("/tunnel", tunnelRouter);
apiRouter.route("/generate", generateRouter);
apiRouter.route("/analyse", analyseRouter);
apiRouter.route("/", proxyRouter);

const router = new Hono();

router.route("/api", apiRouter);
router.route("/", clientRouter);

export default router;
