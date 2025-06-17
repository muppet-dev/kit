import { useThreadRuntime } from "@assistant-ui/react";
import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Plus,
  RefreshCcw,
  ToggleLeft,
  ToggleRight,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { type BaseSyntheticEvent, useState } from "react";
import { ModelField } from "../../../components/ModelField";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { eventHandler } from "../../../lib/eventHandler";
import { useChats } from "../providers";
import type { ChatProps } from "../type";

export function ModelHeader(props: { chatId: string }) {
  const { getChat, addChat, onConfigChange } = useChats();

  const model = getChat(props.chatId);

  if (!model) {
    throw new Error(`Unable to find model with id ${props.chatId}`);
  }

  const SyncButtonIcon = model.sync ? ToggleRight : ToggleLeft;

  const handleConfigChange = (id: string, sync?: boolean) =>
    eventHandler(() => onConfigChange(id, { sync }));

  const handleAddingChat = eventHandler(() => addChat());

  return (
    <div className="p-2 flex items-center gap-1 border-b bg-background">
      <ModelSelect model={model} />
      <div className="flex-1" />
      {model.sync && <SyncedBadge />}
      <Button
        title="Sync chat messages with other models"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max relative"
        onClick={handleConfigChange(model.id, !model.sync)}
        onKeyDown={handleConfigChange(model.id, !model.sync)}
      >
        <SyncButtonIcon className="size-[18px] stroke-secondary-foreground/80" />
        {model.sync && (
          <div className="absolute top-1.5 right-0.5 size-2 rounded-full p-0.5 bg-background">
            <div className="bg-success size-full rounded-[inherit]" />
          </div>
        )}
      </Button>
      <Button
        title="Add model for comparison"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max"
        onClick={handleAddingChat}
        onKeyDown={handleAddingChat}
      >
        <Plus className="size-[18px] stroke-secondary-foreground/80" />
      </Button>
      <OptionsMenu model={model} />
    </div>
  );
}

function ModelSelect(props: { model: ChatProps }) {
  const [value, setValue] = useState<string>(props.model.model);

  const { onConfigChange } = useChats();

  return (
    <ModelField
      value={value}
      onChange={(value) => {
        if (value) {
          onConfigChange(props.model.id, {
            model: value,
          });
          setValue(value);
        }
      }}
    />
  );
}

function SyncedBadge() {
  return (
    <div className="rounded-full select-none px-3.5 pt-0.5 pb-1 text-sm text-muted-foreground bg-secondary font-semibold mr-2">
      Synced
    </div>
  );
}

function OptionsMenu(props: { model: ChatProps }) {
  const threadRuntime = useThreadRuntime();
  const { chats, moveRight, moveLeft, deleteChat } = useChats();

  const index = chats.findIndex((chat) => chat.id === props.model.id);

  const handleClearChat = eventHandler(
    () => threadRuntime.import({ messages: [] }),
    { preventDefault: true },
  );
  const handleMoveRight = eventHandler(() => moveRight(props.model.id), {
    preventDefault: true,
  });
  const handleMoveLeft = eventHandler(() => moveLeft(props.model.id), {
    preventDefault: true,
  });
  const handleDeletingChat = eventHandler(() => deleteChat(props.model.id), {
    preventDefault: true,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="has-[>svg]:px-1.5 py-1.5 h-max data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50"
        >
          <Ellipsis className="size-[18px] stroke-secondary-foreground/80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleClearChat} onKeyDown={handleClearChat}>
          <RefreshCcw className="size-4 text-accent-foreground" />
          Clear Chat
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleMoveRight}
          onKeyDown={handleMoveRight}
          disabled={chats.length === 1 || index === chats.length - 1}
        >
          <ArrowRight className="size-4 text-accent-foreground" />
          Move Right
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleMoveLeft}
          onKeyDown={handleMoveLeft}
          disabled={chats.length === 1 || index === 0}
        >
          <ArrowLeft className="size-4 text-accent-foreground" />
          Move Left
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDeletingChat}
          onKeyDown={handleDeletingChat}
          disabled={chats.length === 1}
        >
          <Trash className="size-4 text-destructive" />
          Delete Chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
