import { Logo } from "../../components/Logo";

export function HomePage() {
  return (
    <div className="flex items-center justify-center flex-col gap-0.5 size-full select-none">
      <Logo className="w-44" />
      <h2 className="text-4xl font-semibold text-muted-foreground/90">
        MCP Inspector
      </h2>
    </div>
  );
}
