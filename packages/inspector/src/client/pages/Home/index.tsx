export function HomePage() {
  return (
    <div className="flex items-center justify-center flex-col size-full select-none">
      <img src="/logo.png" alt="Muppet" className="dark:hidden w-48" />
      <img
        src="/logo-dark.png"
        alt="Muppet"
        className="dark:block hidden w-48"
      />
      <h2 className="text-4xl font-semibold text-muted-foreground/90">
        MCP Inspector
      </h2>
    </div>
  );
}
