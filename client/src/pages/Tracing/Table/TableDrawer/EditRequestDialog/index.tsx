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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpdateRequestForm } from "./Form";

export type EditRequestDialog = Pick<UpdateRequestForm, "request">;

export function EditRequestDialog({ request }: EditRequestDialog) {
  const [isOpen, setOpen] = useState<boolean>();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="p-1.5 size-max">
                <PencilIcon />
              </Button>
            </DialogTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>Update Request</TooltipContent>
      </Tooltip>
      <DialogContent className="!max-w-2xl">
        <DialogHeader className="gap-0">
          <DialogTitle>Update & Send Request</DialogTitle>
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
