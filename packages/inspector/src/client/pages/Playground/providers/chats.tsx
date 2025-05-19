import { useConfig } from "../../../providers";
import { nanoid } from "nanoid";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import type { ChatProps } from "../type";

type ChatsContextType = ReturnType<typeof useChatsManager>;

const ChatsContext = createContext<ChatsContextType | null>(null);

export const ChatsProvider = (props: PropsWithChildren) => {
  const values = useChatsManager();

  return (
    <ChatsContext.Provider value={values}>
      {props.children}
    </ChatsContext.Provider>
  );
};

function useChatsManager() {
  const { getDefaultModel } = useConfig();
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [syncText, setSyncText] = useState<string>("");

  function getChat(chatId: string) {
    const index = chats.findIndex((chat) => chat.id === chatId);
    if (index !== -1) {
      return chats[index];
    }

    return null;
  }

  function onConfigChange(chatId: string, values: Partial<ChatProps>) {
    setChats((prev) => {
      const index = prev.findIndex((chat) => chat.id === chatId);
      if (index !== -1) {
        prev[index] = { ...prev[index], ...values };

        if ("sync" in values) {
          prev[index].composer?.setText(values.sync ? syncText : "");
        }

        return [...prev];
      }
      return prev;
    });
  }

  function addChat() {
    setChats((prev) => [
      ...prev,
      { id: nanoid(), model: getDefaultModel()!, sync: true },
    ]);
  }

  function deleteChat(id: string) {
    setChats((prev) => {
      const index = prev.findIndex((chat) => chat.id === id);
      if (index !== -1) {
        prev.splice(index, 1);
        return [...prev];
      }
      return prev;
    });
  }

  function moveRight(chatId: string) {
    setChats((prev) => {
      const index = prev.findIndex((chat) => chat.id === chatId);
      if (index !== -1 && index < prev.length - 1) {
        const temp = prev[index + 1];
        prev[index + 1] = prev[index];
        prev[index] = temp;
        return [...prev];
      }
      return prev;
    });
  }

  function moveLeft(chatId: string) {
    setChats((prev) => {
      const index = prev.findIndex((chat) => chat.id === chatId);
      if (index !== -1 && index > 0) {
        const temp = prev[index - 1];
        prev[index - 1] = prev[index];
        prev[index] = temp;
        return [...prev];
      }
      return prev;
    });
  }

  function syncTextChange(chatId: string, text: string) {
    setSyncText(text);

    for (const chat of chats) {
      if (chat.sync && chat.composer && chat.id !== chatId) {
        chat.composer?.setText(text);
      }
    }
  }

  return {
    chats,
    getChat,
    onConfigChange,
    addChat,
    deleteChat,
    moveRight,
    moveLeft,
    // Sync
    syncText,
    syncTextChange,
  };
}

export const useChats = () => {
  const context = useContext(ChatsContext);

  if (!context) throw new Error("Missing ModelContext.Provider in the tree!");

  return context;
};
