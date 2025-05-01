import {
  AssistantRuntimeProvider,
  ExportedMessageRepository,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ModelRender } from "./Render";

export type Model = Omit<ModelRender, "onChatClear">;

export function Model(props: Model) {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ModelRender
        {...props}
        onChatClear={() =>
          runtime.threads.main.import(ExportedMessageRepository.fromArray([]))
        }
      />
    </AssistantRuntimeProvider>
  );
}
