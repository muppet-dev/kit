import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useThreadComposer,
  useThreadRuntime,
} from "@assistant-ui/react";
import {
  ArrowDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Pencil,
  RefreshCw,
  SendHorizontal,
} from "lucide-react";
import { type FC, useEffect } from "react";
import { PROVIDER_ICONS } from "../../../../components/icons";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { useChats } from "../../providers";
import { MarkdownText } from "./MarkdownText";
import { TooltipIconButton } from "./TooltipIconButton";

export function Thread(props: { chatId: string } & ThreadWelcome) {
  const { syncTextChange, submitAllSyncedChats, getChat, onConfigChange } =
    useChats();
  const thread = useThreadRuntime();
  const composer = useThreadComposer();

  const chat = getChat(props.chatId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only need to run once
  useEffect(() => {
    onConfigChange(props.chatId, {
      composer: thread.composer,
    });
  }, [props.chatId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only need to run when text changes
  useEffect(() => {
    if (chat?.sync) {
      syncTextChange(props.chatId, composer.text);
    }
  }, [composer.text]);

  return (
    <ThreadPrimitive.Root
      className="bg-background box-border flex h-full flex-col overflow-hidden"
      style={{
        ["--thread-max-width" as string]: "42rem",
      }}
      onSubmit={() => submitAllSyncedChats(props.chatId)}
    >
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <ThreadWelcome modelId={props.modelId} />
        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            EditComposer: EditComposer,
            AssistantMessage: AssistantMessage,
          }}
        />
        <ThreadPrimitive.If empty={false}>
          <div className="min-h-8 flex-grow" />
        </ThreadPrimitive.If>
        <div className="sticky bottom-0 mt-3 flex w-full flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ThreadScrollToBottom />
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
}

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDown />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

type ThreadWelcome = { modelId: string };

const ThreadWelcome = (props: ThreadWelcome) => {
  const [provider, name] = props.modelId.split(":");
  const Icon = PROVIDER_ICONS[provider];

  return (
    <ThreadPrimitive.Empty>
      <div className="flex items-center flex-col h-full justify-center gap-2">
        <Icon className="size-9" />
        <div className="space-x-1 text-lg text-muted-foreground">
          <span>{provider}</span>
          <span>/</span>
          <span className="font-medium text-foreground">{name}</span>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Type your message..."
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <SendHorizontal />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4 [&:where(>*)]:col-start-2 max-w-[var(--thread-max-width)] mx-auto">
      <UserActionBar />
      <div className="bg-muted text-foreground col-start-2 row-start-2 max-w-[var(--thread-max-width)] break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content />
      </div>
      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 row-start-2 mr-3 mt-2.5 flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <Pencil />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] mx-auto flex-col gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />
      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4 max-w-[var(--thread-max-width)] mx-auto">
      <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-[var(--thread-max-width)] break-words leading-7">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
      <AssistantActionBar />
      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground data-[floating]:bg-background col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <Check />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <Copy />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCw />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeft />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRight />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <title>Stop</title>
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
