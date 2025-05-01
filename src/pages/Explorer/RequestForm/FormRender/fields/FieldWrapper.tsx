import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@hookform/error-message";
import { useBlueprint, useDuckForm, useField } from "duck-form";
import { type PropsWithChildren, useEffect, useId, useMemo } from "react";

export type FieldWrapperProps = {
  label?: string;
  required?: boolean;
  onChange?: () => void;
};

export type FieldWrapper = PropsWithChildren;

export function FieldWrapper({ children }: FieldWrapper) {
  const props = useField<FieldWrapperProps>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props],
  );

  const { required, label, onChange, type } = props;

  const componentId = customId ?? autoId;

  useEffect(() => {
    onChange?.();
  }, [onChange]);

  return (
    <div className="relative [&>div>div]:w-full w-full space-y-1">
      <div
        className={cn(
          "flex flex-col gap-1",
          type === "boolean" && "flex-row-reverse w-max gap-2 items-center",
        )}
      >
        {label && (
          <Label
            htmlFor={componentId}
            className={cn(
              required &&
                "after:ml-0.5 after:text-red-500 after:content-['*'] after:dark:text-red-400",
              "leading-snug capitalize",
            )}
          >
            {label}
          </Label>
        )}
        {children}
      </div>
      <FieldErrorMessage name={componentId} />
    </div>
  );
}

function FieldErrorMessage({ name }: { name: string }) {
  return (
    <ErrorMessage
      name={name}
      render={({ message }) => (
        <p className="my-0.5 text-sm text-red-600 dark:text-red-400">
          {message}
        </p>
      )}
    />
  );
}
