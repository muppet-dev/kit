import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useModels } from "../providers";
import { useEffect } from "react";

export type Chat = {
  chatId: string;
};

export function Chat(props: Chat) {
  const { onConfigChange } = useModels();
  const runtime = useChatRuntime({
    api: "http://localhost:8787/api/chat",
    credentials: "include",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Just need to run once
  useEffect(() => {
    onConfigChange(props.chatId, {
      runtime,
    });

    const unSubscriber = runtime.thread.composer.subscribe(() => {
      console.log("Working Componser");
    });

    return () => {
      unSubscriber();
    };
  }, []);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full min-w-[543px] flex flex-col h-full border border-zinc-300 dark:border-zinc-800">
        <ModelHeader chatId={props.chatId} />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}
