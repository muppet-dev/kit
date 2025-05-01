import { reactRenderer } from "@hono/react-renderer";
import { Hono } from "hono";

const router = new Hono()
  .use(
    reactRenderer(({ children }) => {
      return (
        <html lang="en">
          <head>
            <meta charSet="utf-8" />
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />
            {import.meta.env.PROD ? (
              <script type="module" src="/static/client.js" />
            ) : (
              <script type="module" src="/src/main.tsx" />
            )}
            <title>Muppet Inspector</title>
          </head>
          <body>{children}</body>
        </html>
      );
    }),
  )
  .get("/*", (c) => {
    return c.render(<div id="root" />);
  });

export default router;
