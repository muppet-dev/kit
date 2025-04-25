import { CodeHighlighter } from "@/components/Hightlighter";

export type ReponseRender = {
  data: unknown;
};

export function ReponseRender(props: ReponseRender) {
  if (props.data == null) return <></>;

  return (
    <>
      <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-full flex flex-col gap-2 overflow-y-auto">
        <h2 className="text-sm font-semibold">Response</h2>
        <div className="[&>div>pre]:rounded-lg [&>div>pre]:border [&>div>pre]:px-3 [&>div>pre]:py-2 [&>div>pre]:size-full [&>div]:flex [&>div]:size-full h-full overflow-y-auto [&>div]:overflow-y-auto [&>div>pre]:text-sm">
          <CodeHighlighter content={JSON.stringify(props.data, null, 2)} />
        </div>
      </div>
    </>
  );
}
