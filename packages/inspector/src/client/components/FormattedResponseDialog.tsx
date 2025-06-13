import { FormattedDataRender } from "@/client/components/FormattedDataRender";
import { CodeHighlighter } from "@/client/components/Hightlighter";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

export type FormattedResponseDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: Record<string, any>;
};
export function FormattedResponseDialog({
  response,
  onOpenChange,
  open,
}: FormattedResponseDialog) {
  const [formatted, setFormatted] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent isClosable={false} className="sm:max-w-6xl">
        <DialogHeader className="flex-row gap-2 items-center">
          <DialogTitle>Response</DialogTitle>
          <div className="flex-1" />
          <Select
            value={String(Number(formatted))}
            onValueChange={(value) => setFormatted(Boolean(Number(value)))}
          >
            <SelectTrigger
              size="sm"
              className="py-1 px-2 gap-1.5 border-0 h-max"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="1">Formatted</SelectItem>
              <SelectItem value="0">Raw</SelectItem>
            </SelectContent>
          </Select>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="size-max has-[>svg]:px-1.5 py-1.5"
            >
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 space-y-2 h-[600px]">
          {formatted ? (
            <FormattedDataRender
              result={"result" in response ? response.result : response}
            />
          ) : (
            <CodeHighlighter content={JSON.stringify(response, null, 2)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
