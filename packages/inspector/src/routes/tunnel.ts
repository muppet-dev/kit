import { forward, disconnect } from "@ngrok/ngrok";
import { Hono } from "hono";

const router = new Hono();

router.get("/", async (c) => {
  // Disconnecting all existing tunnels
  await disconnect();

  // Creating a new tunnel
  const listener = await forward({
    addr: 3000,
    authtoken: process.env.NGROK_API_KEY,
  });

  return c.json({
    url: listener.url(),
  });
});

export default router;
