import { useFormContext, useWatch } from "react-hook-form";
import { CodeEditor } from "../../../../components/CodeEditor";

export function JSONPanel() {
  const { control, reset } = useFormContext();

  const formData = useWatch({ control });

  const value = formData ? JSON.stringify(formData, null, 2) : undefined;

  return (
    <CodeEditor
      value={value}
      onValueChange={(value) => {
        const data = value ? JSON.parse(value) : undefined;
        reset(data);
      }}
    />
  );
}
