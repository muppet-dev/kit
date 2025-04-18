import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "@hookform/error-message";
import { useBlueprint, useDuckForm, useField } from "duck-form";
import {
  Fragment,
  type PropsWithChildren,
  useEffect,
  useId,
  useMemo,
} from "react";

export type FieldWrapperProps = {
  label?: string;
  description?: string;
  primary?: boolean;
  unique?: boolean;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  onChange?: () => void;
};

export type FieldWrapper = PropsWithChildren<{
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}>;

export function FieldWrapper({ className, children }: FieldWrapper) {
  const props = useField<FieldWrapperProps>();
  const { generateId } = useDuckForm();
  const { schema } = useBlueprint();

  const autoId = useId();
  const customId = useMemo(
    () => generateId?.(schema, props),
    [generateId, schema, props]
  );

  const { required, hidden, label, description, onChange } = props;

  const componentId = customId ?? autoId;

  useEffect(() => {
    onChange?.();
  }, [onChange]);

  const LabelAndDescriptionWrapper =
    label && description
      ? ({ children }: PropsWithChildren) => <div>{children}</div>
      : Fragment;

  return (
    <div
      className={cn(
        hidden && "hidden",
        "relative [&>div>div]:w-full w-full space-y-1",
        className
      )}
    >
      <div>
        <LabelAndDescriptionWrapper>
          {label && (
            <Label
              className={cn(
                required &&
                  "after:ml-0.5 after:text-red-500 after:content-['*'] after:dark:text-red-400",
                "leading-snug"
              )}
            >
              {label}
            </Label>
          )}
          {description && (
            <p className="text-muted-foreground dark:text-muted-foreground text-xs font-medium">
              {description}
            </p>
          )}
        </LabelAndDescriptionWrapper>
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
