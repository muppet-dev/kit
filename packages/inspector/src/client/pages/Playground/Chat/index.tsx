import { useConfig } from "../../../providers";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useChats } from "../providers";
import { ModelHeader } from "./Header";
import { Thread } from "./Thread";
import { useMemo } from "react";

export type Chat = {
  chatId: string;
};

export function Chat(props: Chat) {
  const { connectionInfo, connectionLink, proxyAddress } = useConfig();
  const { getChat } = useChats();

  const chat = getChat(props.chatId);

  const apiEndpoint = useMemo(() => {
    const headers = Object.entries(connectionLink?.headers ?? {}).reduce<{
      headerName?: string;
      bearerToken?: string;
    }>((prev, [key, value]) => {
      prev.headerName = key;
      prev.bearerToken = value;
      return prev;
    }, {});

    const params = paramSerializer({
      modelId: chat?.model,
      ...connectionInfo,
      ...headers,
    });

    return `${proxyAddress}/api/chat?${params}`;
  }, [chat, proxyAddress, connectionInfo, connectionLink]);

  const runtime = useChatRuntime({
    api: apiEndpoint,
  });

  if (!chat) {
    throw new Error(`Unable to find model with id ${props.chatId}`);
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="w-full min-w-[543px] flex flex-col h-full border rounded-md overflow-auto">
        <ModelHeader chatId={props.chatId} />
        <Thread chatId={props.chatId} modelId={chat.model} />
      </div>
    </AssistantRuntimeProvider>
  );
}

function paramSerializer(items: Record<string, unknown>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(items)) {
    if (key === "env") {
      params.set(key, JSON.stringify(value));
    } else {
      params.set(key, String(value));
    }
  }

  return params.toString();
}
