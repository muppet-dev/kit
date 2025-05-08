import { useMCPItem, Tool, useTool } from "../../../../providers";
import { DynamicResourceFieldRender } from "./DynamicResourceFieldRender";
import { PromptFieldRender } from "./PromptFieldRender";
import { ToolFieldsRender } from "./ToolFieldsRender";

export function ToolRender() {
  const { activeTool } = useTool();
  const { selectedItem } = useMCPItem();

  if (!selectedItem) return;

  if (activeTool.name === Tool.TOOLS && selectedItem.type === Tool.TOOLS)
    return <ToolFieldsRender {...selectedItem} />;
  if (activeTool.name === Tool.PROMPTS && selectedItem.type === Tool.PROMPTS)
    return (
      <PromptFieldRender
        {...selectedItem}
        selectedPromptName={selectedItem.name}
      />
    );
  if (
    activeTool.name === Tool.DYNAMIC_RESOURCES &&
    selectedItem.type === Tool.DYNAMIC_RESOURCES
  )
    return <DynamicResourceFieldRender {...selectedItem} />;
}
