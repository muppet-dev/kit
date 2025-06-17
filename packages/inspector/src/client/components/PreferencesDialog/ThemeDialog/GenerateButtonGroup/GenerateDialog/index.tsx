import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { Settings, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { GenerateForm } from "./Form";

export function GenerateDialog() {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <DialogTrigger asChild>
              <Button
                colorScheme="secondary"
                className="size-max has-[>svg]:px-2.5 py-2.5 rounded-l-none"
              >
                <Settings className="size-4" />
              </Button>
            </DialogTrigger>
          </div>
        </TooltipTrigger>
        <TooltipContent>Generate with context</TooltipContent>
      </Tooltip>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-5" />
            <DialogTitle>Generate</DialogTitle>
          </div>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <GenerateForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
