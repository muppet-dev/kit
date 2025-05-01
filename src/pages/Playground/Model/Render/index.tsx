import { useThread, useThreadComposer } from "@assistant-ui/react";
import { ModelHeader } from "./Header";
import type { ModelProps } from "../../type";
import { Thread } from "./Thread";
import { useEffect, useState } from "react";

export type ModelRender = {
  config: ModelProps;
  onConfigChange: (values: ModelProps) => void;
  onChatClear: () => void;
} & Pick<ModelHeader, "addModel" | "deleteModel" | "moveLeft" | "moveRight">;

export function ModelRender(props: ModelRender) {
  const [isSynced, setIsSynced] = useState(true);

  const composer = useThreadComposer();
  const promptText = composer.text;

  console.log(promptText, "current input prompt");

  const { messages } = useThread();

  const lastMessage = messages
    .filter((item) => item.role === "user")
    // @ts-expect-error: text prop exists
    .map((item) => item.content[0].text)
    .at(-1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    props.onConfigChange({ ...props.config, prompt: lastMessage });
  }, [messages]);

  return (
    <div className="w-full min-w-[543px] flex flex-col h-full border border-zinc-300 dark:border-zinc-800">
      <ModelHeader
        {...props}
        clearChat={() => props.onChatClear()}
        isSynced={isSynced}
        onSyncChange={() => setIsSynced((prev) => !prev)}
      />
      <Thread />
    </div>
  );
}
