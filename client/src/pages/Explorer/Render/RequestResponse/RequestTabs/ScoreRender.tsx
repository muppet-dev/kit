import { cn } from "@/lib/utils";
import { useAnalyse } from "./providers/analyse";
import { AnalyseSeverity, type AnalyseDataType } from "./types";

export function ScoreRender() {
  const { analyseData } = useAnalyse();

  if (!analyseData)
    return (
      <div className="flex items-center justify-center w-full h-full text-muted-foreground">
        No analysis data available
      </div>
    );

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col gap-2">
      <div className="border text-3xl text-center py-4 font-bold">
        Score : {analyseData.score}
      </div>
      {analyseData.recommendations.map((item, index) => (
        <ScoreItem key={`${index + 1}-${item.category}`} {...item} />
      ))}
    </div>
  );
}

function ScoreItem(props: AnalyseDataType["recommendations"][0]) {
  return (
    <div className="w-full border flex flex-col px-2.5 py-1 hover:bg-accent/80 dark:hover:bg-accent/50 hover:border-primary/30 transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{props.category}</h4>
        <p
          className={cn(
            "text-sm italic select-none font-medium px-1.5 py-0.5",
            props.severity === AnalyseSeverity.LOW
              ? "text-blue-500 dark:text-blue-300 bg-blue-200/40 dark:bg-blue-300/10"
              : props.severity === AnalyseSeverity.MEDIUM
              ? "text-yellow-500 dark:text-yellow-300 bg-yellow-200/40 dark:bg-yellow-300/10"
              : "text-red-500 dark:text-red-300 bg-red-200/40 dark:bg-red-300/10"
          )}
        >
          {props.severity}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{props.description}</p>
    </div>
  );
}
