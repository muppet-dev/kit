import { useMutation } from "@tanstack/react-query";
import { type FieldValues, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DEFAULT_TOOLS, useTool, useMCPItem } from "../../providers";
import { ReponseRender } from "./Reponse";
import { RequestTabs } from "./RequestTabs";

export function RequestResponseRender() {
  const { activeTool } = useTool();
  const { selectedItem, callItem } = useMCPItem();

  const methods = useForm();

  const { handleSubmit } = methods;

  const mutation = useMutation({
    mutationFn: async (values: FieldValues) => {
      const startTime = performance.now();
      const result = await callItem(selectedItem!, values);
      return {
        duration: performance.now() - startTime,
        content: result,
      };
    },
    onSuccess: () => {
      toast.success("Request completed successfully!");
    },
    onError: (error) => {
      console.error("Request failed:", error);

      toast.error(error.message);
    },
  });

  const activeToolName =
    DEFAULT_TOOLS.find((tool) => tool.name === activeTool.name)?.label ??
    activeTool.name;

  if (!selectedItem)
    return (
      <div className="row-span-2 flex items-center justify-center size-full select-none text-muted-foreground">
        <p className="text-sm">Select a {activeToolName}</p>
      </div>
    );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(
          (values) => mutation.mutateAsync(values),
          console.error
        )}
        className="h-full flex"
      >
        <RequestTabs />
      </form>
      <ReponseRender data={mutation.data} />
    </FormProvider>
  );
}
