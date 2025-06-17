import { cn } from "@/client/lib/utils";
import { useBlueprint, useDuckForm, useField } from "@/client/providers";
import { ErrorMessage } from "@hookform/error-message";
import { type PropsWithChildren, useEffect, useId, useMemo } from "react";
import { Label } from "../ui/label";

export type FieldWrapperProps = {
  label?: string;
  required?: boolean;
  onChange?: () => void;
  description?: string;
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

  const { required, label, onChange, type, description } = props;

  const componentId = customId ?? autoId;

  useEffect(() => {
    onChange?.();
  }, [onChange]);

  return (
    <div className="relative [&>div>div]:w-full w-full space-y-1">
      <div
        className={cn(
          "flex",
          type === "boolean"
            ? "flex-row-reverse w-max gap-2 items-center"
            : "flex-col",
        )}
      >
        {label && (
          <Label
            htmlFor={componentId}
            className="leading-snug capitalize"
            required={required}
          >
            {label}
          </Label>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mb-0.5">{description}</p>
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
        <p className="my-0.5 text-sm text-destructive">{message}</p>
      )}
    />
  );
}
