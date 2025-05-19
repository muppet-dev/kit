import { useConfig } from "../../../providers";
import type { ConnectionInfo } from "../../../providers/connection/manager";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useChats } from "../providers";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";

export type Chat = {
  chatId: string;
};

export function Chat(props: Chat) {
  const { connectionInfo, proxyAddress } = useConfig();
  const { getChat } = useChats();

  const chat = getChat(props.chatId);

  const runtime = useChatRuntime({
    api: `${proxyAddress}/api/chat${
      chat?.model
        ? `?modelId=${chat.model}&${connectionInfoSerializer(connectionInfo)}`
        : ""
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

function connectionInfoSerializer(connectionInfo?: ConnectionInfo): string {
  const params = new URLSearchParams();

  if (connectionInfo)
    for (const [key, value] of Object.entries(connectionInfo)) {
      if (key === "env") {
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    }

  return params.toString();
}
