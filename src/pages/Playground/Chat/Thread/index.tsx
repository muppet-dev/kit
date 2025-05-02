import { Button } from "@/components/ui/button";
import { cn, numberFormatter } from "@/lib/utils";
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
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import { type FC, useEffect } from "react";
import { useModels } from "../../providers";
import type { Chat } from "../index";
import { MarkdownText } from "./MarkdownText";
import { TooltipIconButton } from "./TooltipIconButton";
import {
  type ModelConfig,
  MODELS_CONFIG,
  PROVIDER_ICONS,
} from "../../supportedModels";
import { Link } from "react-router";

export function Thread(props: Chat & ThreadWelcome) {
  const { syncTextChange, getModel, onConfigChange } = useModels();
  const thread = useThreadRuntime();
  const composer = useThreadComposer();

  const chat = getModel(props.chatId);

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
    >
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <ThreadWelcome selectedModel={props.selectedModel} />
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
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

type ThreadWelcome = { selectedModel: ModelConfig };

const ThreadWelcome = (props: ThreadWelcome) => {
  const Icon = PROVIDER_ICONS[props.selectedModel.provider];

  return (
    <ThreadPrimitive.Empty>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-2xl border rounded-lg shadow-xs">
          <div className="px-6 pt-5 text-sm bg-background rounded-t-lg">
            <div className="flex items-center">
              <div className="size-4 mr-2">
                <Icon />
              </div>
              <div className="space-x-1 text-muted-foreground">
                <span>{props.selectedModel.provider}</span>
                <span>/</span>
                <span className="font-medium text-foreground">
                  {props.selectedModel.name}
                </span>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {props.selectedModel.description}
            </div>
          </div>
          <div className="px-6 py-5 text-xs bg-background divide-y">
            <div className="flex items-start py-3">
              <div className="font-medium w-28">Context</div>
              <div className="flex-1 text-muted-foreground">
                {numberFormatter(
                  props.selectedModel.metadata.context,
                  "decimal"
                )}{" "}
                tokens
              </div>
            </div>
            <div className="flex items-start py-3">
              <div className="font-medium w-28">Input Pricing</div>
              <div className="flex-1 text-muted-foreground">
                {numberFormatter(
                  props.selectedModel.metadata.input_pricing,
                  "currency"
                )}{" "}
                / million tokens
              </div>
            </div>
            <div className="flex items-start py-3">
              <div className="font-medium w-28">Output Pricing</div>
              <div className="flex-1 text-muted-foreground">
                {numberFormatter(
                  props.selectedModel.metadata.output_pricing,
                  "currency"
                )}{" "}
                / million tokens
              </div>
            </div>
          </div>
          <div className="px-6 py-5 text-xs font-medium border-t rounded-b-lg bg-zinc-100/75 dark:bg-zinc-900/75">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between space-x-4">
                <Link
                  to={props.selectedModel.metadata.links.model}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-all ease-in-out duration-300"
                >
                  <span>Model Page</span>
                  <SquareArrowOutUpRight className="size-3 ml-1 stroke-[2.5]" />
                </Link>
                <Link
                  to={props.selectedModel.metadata.links.pricing}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-all ease-in-out duration-300"
                >
                  <span>Pricing</span>
                  <SquareArrowOutUpRight className="size-3 ml-1 stroke-[2.5]" />
                </Link>
              </div>
              <Link
                to={props.selectedModel.metadata.links.website}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-all ease-in-out duration-300"
              >
                <span>Website</span>
                <SquareArrowOutUpRight className="size-3 ml-1 stroke-[2.5]" />
              </Link>
            </div>
          </div>
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
            <SendHorizontalIcon />
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
    <MessagePrimitive.Root className="w-full flex items-center gap-2">
      <div className="text-foreground max-w-full break-words px-3 py-2.5">
        <MessagePrimitive.Content />
      </div>
      <UserActionBar />
      <BranchPicker className="" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="mt-2"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full flex-col gap-2 rounded-xl">
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
    <MessagePrimitive.Root className="relative grid w-full grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
      <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7">
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
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
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
      className={cn("text-muted-foreground", className)}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
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
