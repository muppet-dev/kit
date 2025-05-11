import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";
import { useModels } from "../providers";
import { getMCPProxyAddress } from "@/client/providers/connection/manager";

export type Chat = {
  chatId: string;
};

export function Chat(props: Chat) {
  const { getModel } = useModels();

  const model = getModel(props.chatId);

  const runtime = useChatRuntime({
    api: `${getMCPProxyAddress()}/chat?modelId=${model?.model ?? "default"}`,
  });

  if (!model) {
    throw new Error(`Unable to find model with id ${props.chatId}`);
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full min-w-[543px] flex flex-col h-full border border-zinc-300 dark:border-zinc-800">
        <ModelHeader chatId={props.chatId} />
        <Thread chatId={props.chatId} modelId={model.model} />
      </div>
    </AssistantRuntimeProvider>
  );
}
