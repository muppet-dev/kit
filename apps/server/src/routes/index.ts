import { Hono } from "hono";
import proxyRouter from "./proxy";

const router = new Hono();

router.route("/proxy", proxyRouter);

export default router;
