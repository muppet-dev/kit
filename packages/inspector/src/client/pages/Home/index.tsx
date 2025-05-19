import { Logo } from "@/client/components/Sidebar/Logo/Logo";

export function HomePage() {
  return (
    <div className="flex items-center justify-center flex-col size-full select-none">
      <Logo />
      <h2 className="text-4xl font-semibold text-muted-foreground/90">
        MCP Inspector
      </h2>
    </div>
  );
}
