import type { FallbackProps } from "react-error-boundary";

export function ErrorBoundaryRender({ error }: FallbackProps) {
  const { name, message, stack } = error;

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className="max-w-3xl w-full mx-auto bg-background border-t-4 space-y-4 shadow-lg border-destructive flex flex-col p-3 max-h-[500px]"
        style={{ borderRadius: "8px" }}
      >
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-destructive text-sm">Error: {message}</p>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <h3 className="text-xl font-semibold">Source</h3>
          <pre className="overflow-auto flex-1 text-muted-foreground text-sm">
            {stack}
          </pre>
        </div>
      </div>
    </div>
  );
}
