import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Combobox } from "../../../../../components/ui/combobox";
import { Label } from "../../../../../components/ui/label";
import { useCompletionState } from "../../../../../hooks/use-completion-state";
import { useConnection } from "../../../../../providers";
import type { DynamicResourceItemType } from "../../../types";

export function DynamicResourceFieldRender({
  uriTemplate,
}: DynamicResourceItemType) {
  const { control } = useFormContext();
  const { handleCompletion, completionsSupported } = useConnection();

  const { completions, clearCompletions, requestCompletions } =
    useCompletionState(handleCompletion, completionsSupported);

  useEffect(() => {
    clearCompletions();
  }, [clearCompletions]);

  if (!uriTemplate) return null;

  const handleTemplateValueChange = async (key: string, value: string) => {
    if (uriTemplate) {
      requestCompletions(
        {
          type: "ref/resource",
          uri: uriTemplate,
        },
        key,
        value,
      );
    }
  };

  return uriTemplate.match(/{([^}]+)}/g)?.map((param) => {
    const key = param.slice(1, -1);

    return (
      <div key={key} className="space-y-1">
        <Label htmlFor={key}>{key}</Label>
        <Controller
          name={key}
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <Combobox
              id={name}
              placeholder={`Enter ${name}`}
              value={value}
              onChange={(value) => {
                onChange(value);
                handleTemplateValueChange(name, value);
              }}
              onInputChange={(value) => {
                onChange(value);
                handleTemplateValueChange(name, value);
              }}
              options={completions[key] ?? []}
            />
          )}
        />
      </div>
    );
  });
}
