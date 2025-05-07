export function ScoreRender() {
  return (
    <div className="w-full h-full overflow-y-auto flex flex-col gap-2">
      {Array.from({ length: 20 }).map((_, index) => (
        <ScoreItem
          key={`card-${index + 1}`}
          label="Label"
          description="Description"
        />
      ))}
    </div>
  );
}

type ScoreItem = {
  label: string;
  description: string;
};

function ScoreItem(props: ScoreItem) {
  return (
    <div className="w-full border flex flex-col px-2.5 py-1 cursor-pointer hover:bg-accent/80 dark:hover:bg-accent/50 hover:border-primary/30 transition-all ease-in-out">
      <h4 className="font-medium">{props.label}</h4>
      <p className="text-sm text-muted-foreground">{props.description}</p>
    </div>
  );
}
