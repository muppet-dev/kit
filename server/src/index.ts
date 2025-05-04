import { Hono } from "hono";
import { cors } from "hono/cors";
import routes from "./routes/index.js";

const app = new Hono().use(cors());

app.route("/", routes);

app.onError((err, c) => {
  console.error(`Error on ${c.req.path} router`, err);
  return c.json(err, 500);
});

export default app;
