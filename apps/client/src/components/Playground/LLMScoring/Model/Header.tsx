import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { LLMModel } from "@/constants";
import {
  ArrowLeft,
  ArrowRight,
  Ellipsis,
  Plus,
  RefreshCcw,
  Trash,
} from "lucide-react";

export type ModelHeader = {
  model: LLMModel | undefined;
  onModelChange: (model: LLMModel | undefined) => void;
  addModel: () => void;
  clearChat: () => void;
  moveRight: () => void;
  moveLeft: () => void;
  deleteChat: () => void;
};

export function ModelHeader(props: ModelHeader) {
  return (
    <div className="p-2 flex items-center gap-1 border-b border-zinc-300 dark:border-zinc-800 bg-background">
      <Select
        value={props.model}
        onValueChange={(value) => props.onModelChange(value as LLMModel)}
      >
        <SelectTrigger className="w-[300px]">Select Model</SelectTrigger>
        <SelectContent>
          {Object.values(LLMModel).map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex-1" />
      <div className="rounded-full px-3 pt-0.5 pb-1 text-sm text-zinc-500 dark:text-zinc-400 bg-accent font-medium">
        Synced
      </div>
      <Button
        variant="ghost"
        className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm"
        onClick={() => props.addModel()}
        onKeyDown={() => props.addModel()}
      >
        <Plus className="size-[18px]" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="has-[>svg]:px-1.5 py-1.5 h-max rounded-sm data-[state=open]:bg-accent"
          >
            <Ellipsis className="size-[18px]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => props.clearChat()}
            onKeyDown={() => props.clearChat()}
          >
            <RefreshCcw className="size-4 text-accent-foreground" />
            Clear Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => props.moveRight()}
            onKeyDown={() => props.moveRight()}
          >
            <ArrowRight className="size-4 text-accent-foreground" />
            Move Right
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => props.moveLeft()}
            onKeyDown={() => props.moveLeft()}
          >
            <ArrowLeft className="size-4 text-accent-foreground" />
            Move Left
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => props.deleteChat()}
            onKeyDown={() => props.deleteChat()}
          >
            <Trash className="size-4 text-destructive" />
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
