import { Hono } from "hono";
import statsRouter from "./stats";
import serversRouter from "./servers";

const router = new Hono();

router.route("/stats", statsRouter);
router.route("/servers", serversRouter);

export default router;
