import { Tool, useMCPItem, useTool } from "../../../providers";
import { FormWrapper } from "../FormWrapper";
import { DynamicResourceFieldRender } from "./DynamicResourceFieldRender";
import { PromptFieldRender } from "./PromptFieldRender";
import { ToolFieldsRender } from "./ToolFieldsRender";

export function FormPanel() {
  return (
    <FormWrapper className="flex flex-col gap-1.5 overflow-y-auto">
      <PanelRender />
    </FormWrapper>
  );
}

function PanelRender() {
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

  return (
    <div className="size-full flex items-center justify-center select-none text-sm text-muted-foreground">
      <p>Static resources does not have fields</p>
    </div>
  );
}
