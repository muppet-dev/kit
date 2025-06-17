import { config } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";
import routes from "./routes";

if (import.meta.env.DEV) {
  config();
}

const app = new Hono().use(cors());

app.route("/", routes);

app.onError((err, c) => {
  console.error(`Error on ${c.req.path} router`, err);
  return c.json(err, 500);
});

export default app;
