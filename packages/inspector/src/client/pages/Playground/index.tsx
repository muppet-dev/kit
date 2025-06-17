import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useConfig } from "../../providers";
import { Chat } from "./Chat";
import { ChatsProvider, useChats } from "./providers";

export default function PlaygroundPage() {
  const { isModelsEnabled } = useConfig();

  if (!isModelsEnabled)
    return (
      <div className="flex flex-col items-center justify-center gap-2 size-full select-none text-muted-foreground">
        <Sparkles className="size-14" />
        <p className="text-xl font-medium">AI Models are not provided</p>
      </div>
    );

  return (
    <div className="flex gap-2 p-4 w-full overflow-x-auto">
      <ChatsProvider>
        <ChatRenderer />
      </ChatsProvider>
    </div>
  );
}

function ChatRenderer() {
  const { chats, addChat } = useChats();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Adding a default chat
  useEffect(() => {
    if (chats.length === 0) {
      addChat();
    }
  }, []);

  return (
    <>
      {chats.map(({ id }) => (
        <Chat key={id} chatId={id} />
      ))}
    </>
  );
}
