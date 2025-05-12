import { getMCPProxyAddress } from "@/client/providers/connection/manager";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useChats } from "../providers";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";

export type Chat = {
  chatId: string;
};

export function Chat(props: Chat) {
  const { getChat } = useChats();

  const chat = getChat(props.chatId);

  const runtime = useChatRuntime({
    api: `${getMCPProxyAddress()}/chat${
      chat?.model ? `?modelId=${chat.model}` : ""
    }`,
  });

  if (!chat) {
    throw new Error(`Unable to find model with id ${props.chatId}`);
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full min-w-[543px] flex flex-col h-full border border-zinc-300 dark:border-zinc-800">
        <ModelHeader chatId={props.chatId} />
        <Thread chatId={props.chatId} modelId={chat.model} />
      </div>
    </AssistantRuntimeProvider>
  );
}
