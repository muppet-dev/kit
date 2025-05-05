export function ScoreRender() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={`card-${index + 1}`}
          className="w-full border flex flex-col px-2.5 py-1 cursor-pointer hover:bg-accent/80 dark:hover:bg-accent/50 hover:border-primary/30 transition-all ease-in-out"
        >
          <h4 className="font-medium">Label</h4>
          <p className="text-sm text-muted-foreground">Description</p>
        </div>
      ))}
    </>
  );
}
