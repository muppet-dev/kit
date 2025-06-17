import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Combobox } from "../../../../../components/ui/combobox";
import { Label } from "../../../../../components/ui/label";
import { useCompletionState } from "../../../../../hooks/use-completion-state";
import { useConnection } from "../../../../../providers";
import type { PromptItemType } from "../../../types";

export type PromptFieldRender = PromptItemType & { selectedPromptName: string };

export function PromptFieldRender({
  schema,
  selectedPromptName,
}: PromptFieldRender) {
  const { control } = useFormContext();
  const { handleCompletion, completionsSupported } = useConnection();

  const { completions, clearCompletions, requestCompletions } =
    useCompletionState(handleCompletion, completionsSupported);

  useEffect(() => {
    clearCompletions();
  }, [clearCompletions]);

  if (!schema) return null;

  const handleInputChange = async (argName: string, value: string) => {
    if (selectedPromptName) {
      requestCompletions(
        {
          type: "ref/prompt",
          name: selectedPromptName,
        },
        argName,
        value,
      );
    }
  };

  if (Array.isArray(schema))
    return schema.map((item) => (
      <div key={item.name} className="space-y-1">
        <Label
          htmlFor={item.name}
          required={item.required}
          className="leading-snug capitalize"
        >
          {item.name}
        </Label>
        <Controller
          name={item.name}
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <Combobox
              id={name}
              placeholder={`Enter ${name}`}
              value={value}
              onChange={(value) => {
                onChange(value);
                handleInputChange(name, value);
              }}
              onInputChange={(value) => {
                onChange(value);
                handleInputChange(name, value);
              }}
              options={completions[name] ?? []}
            />
          )}
        />
        {item.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {item.description}
            {item.required && (
              <span className="text-xs mt-1 ml-1">(Required)</span>
            )}
          </p>
        )}
      </div>
    ));
}
