import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import inspectorRouter from "./inspector";

const app = new Hono();

app.route("/inspector", inspectorRouter);

app.get(
  "/openapi.json",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "MCP Inspector",
        version: "1.0.0",
      },
    },
  }),
);

app.get(
  "/docs",
  Scalar({
    theme: "saturn",
    url: "/openapi.json",
  }),
);

export default app;
