import { CodeHighlighter } from "@/components/Hightlighter";
import { Tool, useMCPItem } from "../../providers";

export function SchemaPanel() {
  const { selectedItem } = useMCPItem();

  let trasformedItem: Record<string, unknown>;

  if (selectedItem?.type === Tool.TOOLS)
    trasformedItem = {
      name: selectedItem.name,
      description: selectedItem.description,
      inputSchema: selectedItem.schema,
    };
  else if (selectedItem?.type === Tool.PROMPTS)
    trasformedItem = {
      name: selectedItem.name,
      description: selectedItem.description,
      arguments: selectedItem.schema,
    };
  else if (selectedItem?.type === Tool.STATIC_RESOURCES)
    trasformedItem = {
      uri: selectedItem.uri,
      name: selectedItem.name,
      mimeType: selectedItem.mimeType,
    };
  else
    trasformedItem = {
      mimeType: selectedItem?.mimeType,
      name: selectedItem?.name,
      uriTemplate: selectedItem?.uriTemplate,
    };

  const content = JSON.stringify(trasformedItem, null, 2);

  return <CodeHighlighter content={content} />;
}
