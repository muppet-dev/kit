import type { MCPItemType } from "../../../../types";
import { Tool, useTool } from "../../../../providers";
import { DynamicResourceFieldRender } from "./DynamicResourceFieldRender";
import { PromptFieldRender } from "./PromptFieldRender";
import { ToolFieldsRender } from "./ToolFieldsRender";

export type ToolRender = {
  selectedCard: MCPItemType;
};

export function ToolRender({ selectedCard }: ToolRender) {
  const { activeTool } = useTool();

  if (activeTool.name === Tool.TOOLS && selectedCard.type === Tool.TOOLS)
    return <ToolFieldsRender {...selectedCard} />;
  if (activeTool.name === Tool.PROMPTS && selectedCard.type === Tool.PROMPTS)
    return (
      <PromptFieldRender
        {...selectedCard}
        selectedPromptName={selectedCard.name}
      />
    );
  if (
    activeTool.name === Tool.DYNAMIC_RESOURCES &&
    selectedCard.type === Tool.DYNAMIC_RESOURCES
  )
    return <DynamicResourceFieldRender {...selectedCard} />;
}
