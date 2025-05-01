import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";

export type Chat = {
  chatId: string;
};

export function Chat(props: Chat) {
  const runtime = useChatRuntime({
    api: "http://localhost:8787/api/chat",
    credentials: "include",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full min-w-[543px] flex flex-col h-full border border-zinc-300 dark:border-zinc-800">
        <ModelHeader chatId={props.chatId} />
        <Thread chatId={props.chatId} />
      </div>
    </AssistantRuntimeProvider>
  );
}
