import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";
import { useModels } from "../providers";
import { MODELS_CONFIG } from "../supportedModels";

export type Chat = {
  chatId: string;
};

export function Chat(props: Chat) {
  const { getModel } = useModels();

  const model = getModel(props.chatId);

  const runtime = useChatRuntime({
    api: `http://localhost:3000/api/${model?.model ?? "default"}/chat`,
  });

  if (!model) {
    throw new Error(`Unable to find model with id ${props.chatId}`);
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full min-w-[543px] flex flex-col h-full border border-zinc-300 dark:border-zinc-800">
        <ModelHeader chatId={props.chatId} />
        <Thread
          chatId={props.chatId}
          selectedModel={MODELS_CONFIG[model.model]}
        />
      </div>
    </AssistantRuntimeProvider>
  );
}
