import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Info,
  Plus,
  RefreshCcw,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Trash,
} from "lucide-react";
import type { InputHTMLAttributes, PropsWithChildren } from "react";
import type { ModelProps } from "../../type";
import { SUPPORTED_MODELS, type SupportedModels } from "../../supportedModels";

export type ModelHeader = {
  config: ModelProps;
  onConfigChange: (values: ModelProps) => void;
  addModel: () => void;
  clearChat: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  deleteModel: () => void;
  isSynced: boolean;
  onSyncChange: () => void;
};

export function ModelHeader(props: ModelHeader) {
  const SyncButtonIcon = props.isSynced ? ToggleRight : ToggleLeft;

  return (
    <div className="p-2 flex items-center gap-1 border-b border-zinc-300 dark:border-zinc-800 bg-background">
      <Select
        value={props.config.model}
        onValueChange={(value) =>
          props.onConfigChange({
            ...props.config,
            model: value as SupportedModels,
          })
        }
      >
        <SelectTrigger className="w-[300px] rounded-sm">
          {props.config.model ?? "Select Model"}
        </SelectTrigger>
        <SelectContent>
          {Object.keys(SUPPORTED_MODELS).map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-1" />
      {props.isSynced && (
        <div className="rounded-full select-none px-3.5 pt-0.5 pb-1 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-200/70 dark:bg-zinc-800/70 font-semibold mr-2">
          Synced
        </div>
      )}
      <Button
        title="Sync chat messages with other models"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm relative"
        onClick={() => props.onSyncChange()}
        onKeyDown={(event) => {
          if (event.key === "Enter") props.onSyncChange();
        }}
      >
        <SyncButtonIcon className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
        {props.isSynced && (
          <div className="absolute top-1.5 right-0.5 size-2 rounded-full p-0.5 bg-background">
            <div className="bg-green-500 dark:bg-green-300 size-full rounded-[inherit]" />
          </div>
        )}
      </Button>
      <ConfigurationMenu
        maxToken={props.config.maxTokens}
        onMaxTokenChange={(val) =>
          props.onConfigChange({ ...props.config, maxTokens: val })
        }
        temperature={props.config.temperature}
        onTemperatureChange={(val) =>
          props.onConfigChange({ ...props.config, temperature: val })
        }
        topP={props.config.topP}
        onTopPChange={(val) =>
          props.onConfigChange({ ...props.config, topP: val })
        }
      />
      <Button
        title="Add model for comparison"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm"
        onClick={() => props.addModel()}
        onKeyDown={(event) => {
          if (event.key === "Enter") props.addModel();
        }}
      >
        <Plus className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
      </Button>
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
          <DropdownMenuItem
            onClick={() => props.clearChat()}
            onKeyDown={(event) => {
              if (event.key === "Enter") props.clearChat();
            }}
          >
            <RefreshCcw className="size-4 text-accent-foreground" />
            Clear Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => props.moveRight()}
            onKeyDown={(event) => {
              if (event.key === "Enter") props.moveRight();
            }}
          >
            <ArrowRight className="size-4 text-accent-foreground" />
            Move Right
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => props.moveLeft()}
            onKeyDown={(event) => {
              if (event.key === "Enter") props.moveLeft();
            }}
          >
            <ArrowLeft className="size-4 text-accent-foreground" />
            Move Left
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => props.deleteModel()}
            onKeyDown={(event) => {
              if (event.key === "Enter") props.deleteModel();
            }}
          >
            <Trash className="size-4 text-destructive" />
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ConfigurationMenu(props: {
  maxToken: number;
  onMaxTokenChange: (value: number) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  topP: number;
  onTopPChange: (value: number) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          title="Configure model"
          variant="ghost"
          className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50"
        >
          <SlidersHorizontal className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 md:p-4 md:w-[300px] max-w-full space-y-4">
        <div className="flex items-center gap-2">
          <Label>Max Output Tokens</Label>
          <TooltipWrapper content="The maximum number of tokens to return">
            <Info className="size-3.5 stroke-2 stroke-muted-foreground" />
          </TooltipWrapper>
          <div className="flex-1" />
          <NumberInput
            min={50}
            max={2048}
            step={1}
            value={props.maxToken}
            onChange={(event) => {
              const value = event.target.value;
              if (value) props.onMaxTokenChange(Number(value));
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label>Temperature</Label>
          <TooltipWrapper content="Controls the randomness of the returned text; lower is less random">
            <Info className="size-3.5 stroke-2 stroke-muted-foreground" />
          </TooltipWrapper>
          <div className="flex-1" />
          <NumberInput
            min={0}
            max={2}
            step={0.01}
            value={props.temperature}
            onChange={(event) => {
              const value = event.target.value;
              if (value) props.onTemperatureChange(Number(value));
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label>Top P</Label>
          <TooltipWrapper content="The cumulative probability of the most likely tokens to return">
            <Info className="size-3.5 stroke-2 stroke-muted-foreground" />
          </TooltipWrapper>
          <div className="flex-1" />
          <NumberInput
            min={0}
            max={1}
            step={0.01}
            value={props.topP}
            onChange={(event) => {
              const value = event.target.value;
              if (value) props.onTopPChange(Number(value));
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TooltipWrapper(props: PropsWithChildren<{ content: string }>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent
          sideOffset={5}
          className="bg-background border text-sm px-2 py-1 leading-none text-muted-foreground max-w-[350px] text-center"
        >
          <p>{props.content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="number"
      className="py-0 px-1 text-right tabular-nums border border-transparent w-[64px] font-medium text-zinc-700 text-sm tracking-tight rounded dark:bg-black dark:text-zinc-300 focus:outline-none focus:ring-0 hover:border-zinc-200 focus:border-zinc-400 dark:hover:border-zinc-700 dark:focus:border-zinc-500"
    />
  );
}
