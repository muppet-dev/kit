import ngrok from "@ngrok/ngrok";
import { Hono } from "hono";

const router = new Hono();

router.get("/", async (c) => {
  const listener = await ngrok.forward({ addr: 1972, authtoken: "" });

  return c.json({
    id: listener.id,
    url: listener.url,
  });
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const listener = await ngrok.getListener(id);

  if (!listener) {
    return c.json({ error: "Listener not found" }, 404);
  }

  await ngrok.disconnect(listener.url());
});

export default router;
