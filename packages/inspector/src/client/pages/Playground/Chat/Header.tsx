import { ModelField } from "../../../components/ModelField";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { eventHandler } from "../../../lib/eventHandler";
import { useThreadRuntime } from "@assistant-ui/react";
import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Info,
  Plus,
  RefreshCcw,
  ToggleLeft,
  ToggleRight,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { type BaseSyntheticEvent, useState } from "react";
import { useChats } from "../providers";
import type { ChatProps } from "../type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";

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
    <div className="p-2 flex items-center gap-1 border-b border-zinc-300 dark:border-zinc-800 bg-background">
      <ModelSelect model={model} />
      <div className="flex-1" />
      <ExperimentalBadge />
      {model.sync && <SyncedBadge />}
      <Button
        title="Sync chat messages with other models"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm relative"
        onClick={handleConfigChange(model.id, !model.sync)}
        onKeyDown={handleConfigChange(model.id, !model.sync)}
      >
        <SyncButtonIcon className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
        {model.sync && (
          <div className="absolute top-1.5 right-0.5 size-2 rounded-full p-0.5 bg-background">
            <div className="bg-green-500 dark:bg-green-300 size-full rounded-[inherit]" />
          </div>
        )}
      </Button>
      <Button
        title="Add model for comparison"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm"
        onClick={handleAddingChat}
        onKeyDown={handleAddingChat}
        disabled
      >
        <Plus className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
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

function ExperimentalBadge() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer flex items-center gap-1 rounded-full select-none px-3.5 pt-0.5 pb-1 text-sm text-white dark:text-black bg-yellow-500 dark:bg-yellow-300 font-semibold mr-2">
          <TriangleAlert className="size-3.5 mt-0.5 stroke-3" />
          <p>Experimental</p>
        </div>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-1.5">
            <TriangleAlert className="size-5" />
            <DialogTitle>Experimental</DialogTitle>
          </div>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <p>
          This interface uses Vercel's AI SDK with experimental Model Context
          Protocol (MCP) tools support.
        </p>
        <div>
          <p>Please be aware of the following limitations - </p>
          <ul className="list-inside list-disc">
            <li>Only basic tool functionality is supported at this time</li>
            <li>Some advanced MCP features may not work as expected</li>
          </ul>
        </div>
        <p>
          For production applications, consider implementing fallback mechanisms
          or monitoring for potential issues. <br />
          Check the{" "}
          <a
            href="https://ai-sdk.dev/cookbook/node/mcp-tools"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 dark:text-blue-300 hover:underline"
          >
            AI SDK documentation
          </a>{" "}
          for the latest updates.
        </p>
      </DialogContent>
    </Dialog>
  );
}

function SyncedBadge() {
  return (
    <div className="rounded-full select-none px-3.5 pt-0.5 pb-1 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-200/70 dark:bg-zinc-800/70 font-semibold mr-2">
      Synced
    </div>
  );
}

function OptionsMenu(props: { model: ChatProps }) {
  const threadRuntime = useThreadRuntime();
  const { chats, moveRight, moveLeft, deleteChat } = useChats();

  const index = chats.findIndex((chat) => chat.id === props.model.id);

  const handleClearChat = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    threadRuntime.import({ messages: [] });
  };
  const handleMoveRight = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    moveRight(props.model.id);
  };
  const handleMoveLeft = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    moveLeft(props.model.id);
  };
  const handleDeletingChat = (event: BaseSyntheticEvent) => {
    if ("key" in event && event.key !== "Enter") return;
    deleteChat(props.model.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50"
        >
          <Ellipsis className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
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
