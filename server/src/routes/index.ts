import { Hono } from "hono";
import utilsRouter from "./utils.js";
import proxyRouter from "./proxy/index.js";
import tunnelRouter from "./tunnel.js";

const router = new Hono().basePath("/api");

router.route("/", utilsRouter);
router.route("/", proxyRouter);
router.route("/tunnel", tunnelRouter);

export default router;
