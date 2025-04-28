import { CodeHighlighter } from "@/components/Hightlighter";

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
            {props.data.duration.toFixed(2)} ms
          </span>
        </div>
        <div className="[&>div>pre]:rounded-lg [&>div>pre]:border [&>div>pre]:px-3 [&>div>pre]:py-2 [&>div>pre]:size-full [&>div]:flex [&>div]:size-full h-full overflow-y-auto [&>div]:overflow-y-auto [&>div>pre]:text-sm">
          <CodeHighlighter
            content={JSON.stringify(props.data.content, null, 2)}
          />
        </div>
      </div>
    </>
  );
}
