import { Hono } from "hono";
import configRouter from "./config";
import inspectorRouter from "./inspector";
import proxyRouter from "./proxy";

const router = new Hono();

router.route("/api", proxyRouter);
router.route("/api/config", configRouter);
router.route("/", inspectorRouter);

export default router;
