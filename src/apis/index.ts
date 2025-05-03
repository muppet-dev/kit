import { Hono } from "hono";
import utilsRouter from "./utils";
import inspectorRouter from "./inspector";
import proxyRouter from "./proxy";
import tunnelRouter from "./tunnel";

const router = new Hono();

router.route("/api", utilsRouter);
router.route("/api", proxyRouter);
router.route("/api/tunnel", tunnelRouter);
router.route("/", inspectorRouter);

export default router;
