import type { ImageContent } from "@modelcontextprotocol/sdk/types.js";

export function ImageRender(props: ImageContent) {
  const src = `data:${props.mimeType};base64,${props.data}`;

  return (
    <img
      src={src}
      alt="Rendered content"
      className="size-full object-contain"
    />
  );
}
