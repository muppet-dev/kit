import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContextDialog } from "./providers";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContextDialog() {
  const { open, setOpen } = useContextDialog();

  return (
    <Dialog
      open={open != null}
      onOpenChange={(open) => {
        if (!open) setOpen(null);
      }}
    >
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Context</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <Label>Context</Label>
        <Textarea />
        <Button className="ml-auto">Save</Button>
      </DialogContent>
    </Dialog>
  );
}
