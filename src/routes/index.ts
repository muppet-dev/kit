import { Hono } from "hono";
import proxyRouter from "./proxy";
import inspectorRouter from "./inspector";

const router = new Hono();

router.route("/api", proxyRouter);
router.route("/", inspectorRouter);

export default router;
