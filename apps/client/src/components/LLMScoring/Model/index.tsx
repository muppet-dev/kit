import {
  AssistantRuntimeProvider,
  ExportedMessageRepository,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";

export type ModelRender = Omit<ModelHeader, "clearChat">;

export function ModelRender(props: ModelRender) {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full flex flex-col h-full border border-zinc-300 dark:border-zinc-800">
        <ModelHeader
          {...props}
          clearChat={() =>
            runtime.threads.main.import(ExportedMessageRepository.fromArray([]))
          }
        />
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}
