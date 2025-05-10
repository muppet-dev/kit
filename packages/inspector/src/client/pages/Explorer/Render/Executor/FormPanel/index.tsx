import { useFormContext } from "react-hook-form";
import { Tool, useMCPItem, useTool } from "../../../providers";
import { useCustomForm } from "../provider";
import { DynamicResourceFieldRender } from "./DynamicResourceFieldRender";
import { PromptFieldRender } from "./PromptFieldRender";
import { ToolFieldsRender } from "./ToolFieldsRender";

export function FormPanel() {
  const { handleSubmit } = useFormContext();

  const mutation = useCustomForm();

  return (
    <form
      id="request-form"
      onSubmit={handleSubmit(
        (values) => mutation.mutateAsync(values),
        console.error
      )}
      className="h-full w-full flex flex-col gap-1.5 overflow-y-auto"
    >
      <PanelRender />
    </form>
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
}
