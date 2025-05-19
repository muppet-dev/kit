import { Skeleton } from "../../../../components/ui/skeleton";
import { cn } from "../../../../lib/utils";
import { useTool } from "../../providers";
import {
  type AnalyseDataType,
  AnalyseSeverity,
  useAnalyse,
} from "./AnalyseButtonGroup/provider";

enum Score {
  VPOOR = "Very Poor",
  POOR = "Poor",
  AVERAGE = "Average",
  GOOD = "Good",
  EXCELLENT = "Excellent",
}

const scoreTextColor = {
  [Score.VPOOR]: "text-red-500 dark:text-red-300",
  [Score.POOR]: "text-orange-500 dark:text-orange-300",
  [Score.AVERAGE]: "text-yellow-500 dark:text-yellow-300",
  [Score.GOOD]: "text-green-500 dark:text-green-300",
  [Score.EXCELLENT]: "text-green-600 dark:text-green-400",
};

const scoreBgColor = {
  [Score.VPOOR]: "bg-red-500 dark:bg-red-400",
  [Score.POOR]: "bg-orange-500 dark:bg-orange-400",
  [Score.AVERAGE]: "bg-yellow-500 dark:bg-yellow-400",
  [Score.GOOD]: "bg-green-500 dark:bg-green-400",
  [Score.EXCELLENT]: "bg-green-600 dark:bg-green-500",
};

export function AnalysePanel() {
  const { data, isPending } = useAnalyse();
  const { activeTool } = useTool();

  const scoreRemark = data ? getScoreRemark(data.score) : undefined;

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col gap-2">
      <div>
        <p className="text-sm text-muted-foreground">
          {activeTool.label} Score
        </p>
        <div className="mt-1 px-2 flex w-full items-center justify-between">
          {isPending ? (
            <Skeleton className="h-12 w-8" />
          ) : (
            <p className="text-5xl">
              {data ? <span className="font-semibold">{data.score}</span> : "-"}
            </p>
          )}
          {isPending ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p
              className={cn(
                "text-lg font-semibold",
                // @ts-expect-error: it does not give undefined value
                scoreTextColor[scoreRemark]
              )}
            >
              {scoreRemark}
            </p>
          )}
        </div>
        <div className="grid grid-cols-5 w-full">
          {Object.entries(Score).map(([key, value]) => (
            <div key={key} className="group w-full h-8 grid items-end">
              <p
                className={cn(
                  "text-xs text-center select-none opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-150",
                  scoreTextColor[value]
                )}
              >
                {value}
              </p>
              <div
                className={cn(
                  scoreBgColor[value],
                  scoreRemark === value
                    ? "h-4"
                    : "h-2 group-hover:h-4 transition-all ease-in-out"
                )}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 text-xs text-muted-foreground select-none">
          <p>0</p>
          <p className="pl-6">2</p>
          <p className="pl-[49px]">4</p>
          <p className="pl-[75px]">6</p>
          <p className="pl-[103px]">8</p>
          <p className="text-end">10</p>
        </div>
      </div>
      <div className="flex flex-col gap-[inherit] h-full overflow-y-auto">
        <p className="text-sm text-muted-foreground">Recommendations</p>
        {isPending ? (
          Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={i} className="h-[54px] w-full mb-2" />
          ))
        ) : !data || data.recommendations.length === 0 ? (
          <div className="border h-full w-full flex items-center justify-center select-none">
            <p className="text-sm text-muted-foreground">
              No recommendation available
            </p>
          </div>
        ) : (
          data.recommendations.map((item, index) => (
            <ScoreItem key={`${index + 1}-${item.category}`} {...item} />
          ))
        )}
      </div>
    </div>
  );
}

function ScoreItem(props: AnalyseDataType["recommendations"][0]) {
  return (
    <div className="w-full select-none border flex flex-col px-2.5 py-1 hover:bg-accent/80 dark:hover:bg-accent/50 hover:border-primary/30 transition-all ease-in-out">
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

function getScoreRemark(score: number) {
  if (score >= 0 && score <= 2) return Score.VPOOR;
  if (score > 2 && score <= 4) return Score.POOR;
  if (score > 4 && score <= 6) return Score.AVERAGE;
  if (score > 6 && score <= 8) return Score.GOOD;
  if (score > 8 && score <= 10) return Score.EXCELLENT;
}
