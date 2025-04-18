import { Hono } from "hono";
import proxyRouter from "./proxy";

const router = new Hono();

router.route("/", proxyRouter);

export default router;
