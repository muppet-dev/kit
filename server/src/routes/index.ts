import { Hono } from "hono";
import utilsRouter from "./utils.js";
import proxyRouter from "./proxy/index.js";
import tunnelRouter from "./tunnel.js";
import modelRouter from "./models/index.js";
import generateRouter from "./generate.js";
import scoreRouter from "./score.js";

const router = new Hono().basePath("/api");

router.route("/", utilsRouter);
router.route("/", modelRouter);
router.route("/tunnel", tunnelRouter);
router.route("/generate", generateRouter);
router.route("/score", scoreRouter);
router.route("/", proxyRouter);

export default router;
