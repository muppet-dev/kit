import { CodeHighlighter } from "@/components/Hightlighter";
import { numberFormatter } from "../../../lib/utils";

export type ReponseRender = {
  data?: {
    duration: number;
    content: unknown;
  };
};

export function ReponseRender(props: ReponseRender) {
  if (props.data == null) return <></>;

  return (
    <>
      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-full flex flex-col gap-2 overflow-y-auto">
        <div className="flex">
          <h2 className="text-sm font-semibold">Response</h2>
          <div className="flex-1" />
          <span className="text-xs text-green-600 font-medium dark:text-green-400">
            {props.data.duration > 1000
              ? `${numberFormatter(
                  Number((props.data.duration / 1000).toFixed(2)),
                  "decimal",
                )} s`
              : `${numberFormatter(props.data.duration, "decimal")} ms`}
          </span>
        </div>
        <CodeHighlighter
          content={JSON.stringify(props.data.content, null, 2)}
        />
      </div>
    </>
  );
}
