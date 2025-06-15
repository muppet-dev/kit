import { serve, type ServerType } from "@hono/node-server";
import { loadConfig } from "c12";
import type { Hono } from "hono";
import type { SanitizedInspectorConfig } from "../types";
import openBrowser from "open";
import * as readline from "node:readline";
import { blue, bold, cyan, dim, underline, bgHex, yellow } from "ansis";

type InspectorActionOptions = {
  options: Record<string, string>;
  app: (config: SanitizedInspectorConfig) => Hono;
};

// Function to create a smooth gradient line
function createGradient(width = 80, height = 6) {
  for (let y = 0; y < height; y++) {
    let line = "  ";
    for (let x = 0; x < width; x++) {
      // Calculate gradient position (0 to 1)
      const t = x / (width - 1);

      // Interpolate between cyan (#00BFFF) and lime (#98FF04)
      const r = Math.round(0 + t * 152); // 0 to 152
      const g = Math.round(191 + t * 64); // 191 to 255
      const b = Math.round(255 - t * 251); // 255 to 4

      const color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      line += bgHex(color)(" ");
    }
    console.log(line);
  }
}

export async function inspectorAction({
  options,
  app,
}: InspectorActionOptions) {
  console.log();
  console.log();
  createGradient(30, 1);
  console.log(`${bold("  muppet")}  ${blue(`v${options.version}`)}`);
  console.log();

  // Load the config file
  const { config, source } = await loadConfig<SanitizedInspectorConfig>({
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

  if (source) {
    console.log(dim("  config       ") + blue(source));
    console.log();
  }

  if (options?.port) {
    config.port = Number(options?.port);
  }

  if (options?.host) {
    config.host = options?.host;
  }

  let server: ServerType;

  let restartTimer: ReturnType<typeof setTimeout> | undefined;
  function restartServer() {
    clearTimeout(restartTimer!);
    restartTimer = setTimeout(() => {
      console.log(yellow("\n  restarting...\n"));
      initServer();
    }, 500);
  }

  function initServer() {
    if (server) server.close();

    server = serve({
      fetch: app(config).fetch,
      port: config.port,
      hostname: config.host,
    });
  }

  const url = `http://${config.host}:${config.port}`;

  const SHORTCUTS = [
    {
      name: "r",
      fullname: "restart",
      action() {
        restartServer();
      },
    },
    {
      name: "o",
      fullname: "open",
      action() {
        openBrowser(url);
      },
    },
    {
      name: "q",
      fullname: "quit",
      action() {
        try {
          server?.close();
        } finally {
          process.exit();
        }
      },
    },
  ];

  function bindShortcut() {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    process.stdin.on("keypress", (str, key) => {
      if (key.ctrl && key.name === "c") {
        process.exit();
      } else {
        const [sh] = SHORTCUTS.filter((item) => item.name === str);
        if (sh) {
          try {
            sh.action();
          } catch (err) {
            console.error(`Failed to execute shortcut ${sh.fullname}`, err);
          }
        }
      }
    });
  }

  console.log(`${dim("  inspector   ")}  > ${cyan(`${url}/`)}`);
  bindShortcut();
  initServer();

  if (config.auto_open) {
    await openBrowser(url, {
      wait: false,
    });
  }

  console.log();
  console.log(
    `${dim("  shortcuts ")}    > ${underline("r")}${dim("estart | ")}${underline("o")}${dim("pen | ")}${underline("q")}${dim("uit")}`,
  );
}
