import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import type { SSEStreamingApi } from "hono/streaming";
import { nanoid } from "nanoid";

export class Broadcast {
  streams: Map<string, SSEStreamingApi> = new Map();

  addStream(stream: SSEStreamingApi) {
    this.streams.set(nanoid(), stream);
  }

  sendMessage(payload: {
    session?: string;
    from: string;
    message: JSONRPCMessage;
  }) {
    for (const stream of this.streams.values()) {
      stream.writeSSE({
        data: JSON.stringify({
          at: Date.now(),
          ...payload,
        }),
      });
    }
  }

  closeStream(id: string) {
    const stream = this.streams.get(id);
    if (stream) {
      stream.close();
      this.streams.delete(id);
    }
  }

  closeAllStreams() {
    for (const stream of this.streams.values()) {
      stream.close();
    }

    this.streams.clear();
  }
}
