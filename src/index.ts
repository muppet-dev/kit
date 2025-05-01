import { Hono } from "hono";
import routes from "./apis";
import { cors } from "hono/cors";

const app = new Hono().use(cors());

app.route("/", routes);

app.onError((err, c) => {
  console.error(`Error on ${c.req.path} router`, err);
  return c.json(err, 500);
});

export default app;
