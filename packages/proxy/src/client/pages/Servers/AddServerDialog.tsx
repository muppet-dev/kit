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
import { Plus } from "lucide-react";
import { ServerForm } from "./Form";
import { useState } from "react";

export function AddServerDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Add Server
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent isClosable={false}>
        <DialogHeader>
          <div className="flex items-center gap-1.5">
            <Plus className="size-5" />
            <DialogTitle>Add Server</DialogTitle>
          </div>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <ServerForm type="add" onSubmit={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
