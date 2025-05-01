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
import {
  PROPERTIES_CONFIG,
  MODELS_CONFIG,
  type SupportedModels,
} from "../supportedModels";
import type { Chat } from "./index";
import { useModels } from "../providers";
import { useThreadRuntime } from "@assistant-ui/react";

export function ModelHeader(props: Chat) {
  const {
    getModel,
    addModel,
    deleteModel,
    moveRight,
    moveLeft,
    onConfigChange,
  } = useModels();
  const threadRuntime = useThreadRuntime();

  const model = getModel(props.chatId);

  if (!model) {
    throw new Error(`Unable to find model with id ${props.chatId}`);
  }

  const SyncButtonIcon = model.sync ? ToggleRight : ToggleLeft;

  const selectedModelConfig = MODELS_CONFIG[model.model];

  return (
    <div className="p-2 flex items-center gap-1 border-b border-zinc-300 dark:border-zinc-800 bg-background">
      <Select
        value={model.model}
        onValueChange={(value) =>
          onConfigChange(model.id, {
            model: value as SupportedModels,
          })
        }
      >
        <SelectTrigger className="w-[300px] rounded-sm">
          {selectedModelConfig.provider} {selectedModelConfig.name}
        </SelectTrigger>
        <SelectContent>
          {Object.entries(MODELS_CONFIG).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value.provider} {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-1" />
      {model.sync && (
        <div className="rounded-full select-none px-3.5 pt-0.5 pb-1 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-200/70 dark:bg-zinc-800/70 font-semibold mr-2">
          Synced
        </div>
      )}
      <Button
        title="Sync chat messages with other models"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm relative"
        onClick={() => onConfigChange(model.id, { sync: !model.sync })}
        onKeyDown={(event) => {
          if (event.key === "Enter")
            onConfigChange(model.id, { sync: !model.sync });
        }}
      >
        <SyncButtonIcon className="size-[18px] stroke-zinc-600 dark:stroke-zinc-300" />
        {model.sync && (
          <div className="absolute top-1.5 right-0.5 size-2 rounded-full p-0.5 bg-background">
            <div className="bg-green-500 dark:bg-green-300 size-full rounded-[inherit]" />
          </div>
        )}
      </Button>
      <ConfigurationMenu modelId={model.model} />
      <Button
        title="Add model for comparison"
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm"
        onClick={() => addModel()}
        onKeyDown={(event) => {
          if (event.key === "Enter") addModel();
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
            onClick={() => threadRuntime.import({ messages: [] })}
            onKeyDown={(event) => {
              if (event.key === "Enter") threadRuntime.import({ messages: [] });
            }}
          >
            <RefreshCcw className="size-4 text-accent-foreground" />
            Clear Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => moveRight(model.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter") moveRight(model.id);
            }}
          >
            <ArrowRight className="size-4 text-accent-foreground" />
            Move Right
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => moveLeft(model.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter") moveLeft(model.id);
            }}
          >
            <ArrowLeft className="size-4 text-accent-foreground" />
            Move Left
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => deleteModel(model.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter") deleteModel(model.id);
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

type ConfigurationMenu = {
  modelId: SupportedModels;
};

function ConfigurationMenu(porps: ConfigurationMenu) {
  const { onConfigChange } = useModels();

  const modelConfig = MODELS_CONFIG[porps.modelId];

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
        {Object.entries(modelConfig.properties).map(([key, value]) => {
          const propertyConfig =
            PROPERTIES_CONFIG[key as keyof typeof PROPERTIES_CONFIG];

          return (
            <div key={key} className="flex items-center gap-2">
              <Label>{propertyConfig.label}</Label>
              <TooltipWrapper content={propertyConfig.description}>
                <Info className="size-3.5 stroke-2 stroke-muted-foreground" />
              </TooltipWrapper>
              <div className="flex-1" />
              <NumberInput
                min={value?.min}
                max={value?.max}
                step={1}
                value={value?.default}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value)
                    onConfigChange(porps.modelId, {
                      [key]: Number(value),
                    });
                }}
              />
            </div>
          );
        })}
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
