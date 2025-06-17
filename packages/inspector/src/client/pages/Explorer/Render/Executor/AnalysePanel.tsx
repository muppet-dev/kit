import { Skeleton } from "../../../../components/ui/skeleton";
import { cn } from "../../../../lib/utils";
import { useTool } from "../../providers";
import {
  type AnalyseDataType,
  AnalyseSeverity,
  useAnalyse,
} from "./AnalyseButtonGroup/useAnalyse";

enum Score {
  VPOOR = "Very Poor",
  POOR = "Poor",
  AVERAGE = "Average",
  GOOD = "Good",
  EXCELLENT = "Excellent",
  UNKNOWN = "Unknown",
}

const scoreTextColor = {
  [Score.VPOOR]: "text-destructive",
  [Score.POOR]: "text-alert",
  [Score.AVERAGE]: "text-warning",
  [Score.GOOD]: "text-success/80 dark:text-success",
  [Score.EXCELLENT]: "text-success dark:text-success/80",
  [Score.UNKNOWN]: "text-muted-foreground",
};

const scoreBgColor = {
  [Score.VPOOR]: "bg-destructive",
  [Score.POOR]: "bg-alert",
  [Score.AVERAGE]: "bg-warning",
  [Score.GOOD]: "bg-success/80 dark:bg-success",
  [Score.EXCELLENT]: "bg-success dark:bg-success/80",
  [Score.UNKNOWN]: "bg-muted-foreground",
};

export function AnalysePanel() {
  const { activeTool } = useTool();
  const { data, isFetching } = useAnalyse();

  const scoreRemark = data ? getScoreRemark(data.score) : undefined;

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col gap-2">
      <div>
        <p className="text-sm text-muted-foreground">
          {activeTool.label} Score
        </p>
        <div className="mt-1 px-2 flex w-full items-center justify-between">
          {isFetching ? (
            <Skeleton className="h-12 w-8 rounded-md" />
          ) : (
            <p className="text-5xl">
              {data ? <span className="font-semibold">{data.score}</span> : "-"}
            </p>
          )}
          {isFetching ? (
            <Skeleton className="h-7 w-16 rounded-md" />
          ) : (
            <p
              className={cn(
                "text-lg font-semibold",
                // @ts-expect-error: it does not give undefined value
                scoreTextColor[scoreRemark],
              )}
            >
              {scoreRemark}
            </p>
          )}
        </div>
        <div className="grid grid-cols-6 w-full">
          {Object.entries(Score).map(([key, value]) => (
            <div key={key} className="group w-full h-8 grid items-end">
              <p
                className={cn(
                  "text-xs text-center select-none opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-150",
                  scoreTextColor[value],
                )}
              >
                {value}
              </p>
              <div
                className={cn(
                  scoreBgColor[value],
                  scoreRemark === value
                    ? "h-4"
                    : "h-2 group-hover:h-4 transition-all ease-in-out",
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
        {isFetching ? (
          Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={i} className="h-[54px] w-full rounded-md" />
          ))
        ) : !data || data.recommendations.length === 0 ? (
          <div className="border rounded-md h-full w-full flex items-center justify-center select-none">
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
    <div className="w-full select-none border flex flex-col px-2.5 py-1 hover:bg-accent/80 dark:hover:bg-accent/50 hover:border-primary/30 transition-all ease-in-out rounded-md">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{props.category}</h4>
        <p
          className={cn(
            "text-sm italic select-none font-medium px-1.5 py-0.5",
            props.severity === AnalyseSeverity.LOW
              ? "text-info bg-info/10"
              : props.severity === AnalyseSeverity.MEDIUM
                ? "text-warning bg-warning/10"
                : "text-destructive bg-destructive/10",
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

  return Score.UNKNOWN;
}
