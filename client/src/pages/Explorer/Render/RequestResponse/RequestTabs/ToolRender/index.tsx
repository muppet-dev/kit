import { Tool, useTool } from "../../../../providers";
import { PromptFieldRender } from "./PromptFieldRender";
import { ToolFieldsRender } from "./ToolFieldsRender";
import { DynamicResourceFieldRender } from "./DynamicResourceFieldRender";

export type ToolRender = {
  selectedCard: {
    name: string;
    description?: string;
    schema?: ToolFieldsRender["schema"] | PromptFieldRender["schema"];
    uri?: string;
    uriTemplate?: string;
    mimeType?: string;
  };
  current: string;
};

export function ToolRender({ current, selectedCard }: ToolRender) {
  const { activeTool } = useTool();

  if (activeTool.name === Tool.TOOLS)
    return (
      <ToolFieldsRender
        schema={selectedCard?.schema as ToolFieldsRender["schema"]}
      />
    );
  if (activeTool.name === Tool.PROMPTS)
    return (
      <PromptFieldRender
        schema={selectedCard?.schema as PromptFieldRender["schema"]}
        selectedPromptName={current}
      />
    );
  if (activeTool.name === Tool.DYNAMIC_RESOURCES)
    return (
      <DynamicResourceFieldRender uriTemplate={selectedCard?.uriTemplate} />
    );
}
