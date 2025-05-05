import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { Editor } from "./Editor";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type EditRequestDialog = Pick<Editor, "request">;

export function EditRequestDialog({ request }: EditRequestDialog) {
  const [isOpen, setOpen] = useState<boolean>();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="p-1 size-max">
                <PencilIcon className="size-4" />
              </Button>
            </DialogTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>Edit Request</TooltipContent>
      </Tooltip>
      <DialogContent className="!max-w-2xl">
        <DialogHeader className="gap-0">
          <DialogTitle>Edit Request</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <Editor request={request} closeDialog={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
