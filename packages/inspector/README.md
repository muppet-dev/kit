# Muppet Inspector

It is a devtool for testing and debugging MCPs servers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/muppet-dev/kit/tree/main/packages/inspector)

![Inspector](https://raw.githubusercontent.com/muppet-dev/kit/main/public/inspector.png)

## Usage

```bash
npx muppet-kit inspector
```

## Features

- Explorer - Explore the MCP server's capabilities, while leveraging AI to assist you.
- Playground - Test the MCP server with different LLMs and configurations.
- MCP Scan - Scan the MCP server for vulnerabilities and security issues.
- Tracing - Trace the requests and responses between the client and server. Tunneling is also supported for connecting to remote clients.
- History - View the history of requests and responses between the client and server for the current session.

## Configuration

You can configure the inspector by creating a `muppet.config.js`/`muppet.config.ts` file in the root of your project. The configuration file should export an object with the following properties:

```ts
import { defineInspectorConfig } from "muppet-kit";
import { ngrok } from "muppet-kit/tunnel";
import { openai } from "@ai-sdk/openai";

export default defineInspectorConfig({
  // ...
  models: [openai("gpt-4.1-nano")],
  // You can either pass the API key here or have it in .env as NGROK_API_KEY
  tunneling: ngrok(),
});
```

## Credits

The idea for this project was inspired by the official [MCP Inspector](https://github.com/modelcontextprotocol/inspector) and their amazing work.
