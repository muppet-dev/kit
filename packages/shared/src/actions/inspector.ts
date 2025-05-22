import { serve } from "@hono/node-server";
import { loadConfig } from "c12";
import type { Hono } from "hono";
import type { SanitizedInspectorConfig } from "../types";
import open from "open";

type InspectorActionOptions = {
  options?: Record<string, string>;
  app: (config: SanitizedInspectorConfig) => Hono;
};

export async function inspectorAction({
  options,
  app,
}: InspectorActionOptions) {
  console.log("Starting the Inspector...");

  // Load the config file
  const { config } = await loadConfig<SanitizedInspectorConfig>({
    dotenv: true,
    ...(options?.config
      ? {
          configFile: options?.config,
        }
      : { name: "muppet" }),
    defaultConfig: {
      port: 3553,
      host: "localhost",
    },
  });

  if (options?.port) {
    config.port = Number(options?.port);
  }

  if (options?.host) {
    config.host = options?.host;
  }

  serve({
    fetch: app(config).fetch,
    port: config.port,
    hostname: config.host,
  });

  const url = `http://${config.host}:${config.port}`;

  console.log(`Inspector is up and running at ${url}`);

  if (config.auto_open) {
    await open(url, {
      wait: false,
    });
  }
}
