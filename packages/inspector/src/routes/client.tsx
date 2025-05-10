import { Hono } from "hono";
import { reactRenderer } from "@hono/react-renderer";

const router = new Hono().get(
  "/*",
  reactRenderer(({ children }) => {
    return (
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Muppet Inspector</title>
        </head>
        <body>{children}</body>
      </html>
    );
  }),
  (c) =>
    c.render(
      <>
        <div id="root" />
        <script
          type="module"
          src={
            import.meta.env.PROD
              ? "./static/client.js"
              : "./src/client/main.tsx"
          }
        />
      </>,
    ),
);

export default router;
