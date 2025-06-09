import { AudioContent } from "@modelcontextprotocol/sdk/types.js";

export function AudioRender(props: AudioContent) {
  const src = `data:${props.mimeType};base64,${props.data}`;

  return <audio src={src} />;
}
