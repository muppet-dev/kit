import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";
import { UpdateRequestForm } from "./Form";

export type UpdateRequestDialog = Pick<UpdateRequestForm, "request">;

export function UpdateRequestDialog({ request }: UpdateRequestDialog) {
  const [isOpen, setOpen] = useState<boolean>();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="p-1.5 size-max">
                <Pencil />
              </Button>
            </DialogTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>Update Request</TooltipContent>
      </Tooltip>
      <DialogContent className="!max-w-2xl">
        <DialogHeader className="gap-0">
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-[18px]" /> Send Request
          </DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <UpdateRequestForm
          request={request}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
