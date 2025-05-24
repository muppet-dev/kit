import { ErrorMessage } from "@hookform/error-message";

export function FieldErrorMessage(props: { name: string }) {
  return (
    <ErrorMessage
      name={props.name}
      render={({ message }) => (
        <p className="text-sm text-red-600 dark:text-red-400 col-span-4">
          {message}
        </p>
      )}
    />
  );
}
