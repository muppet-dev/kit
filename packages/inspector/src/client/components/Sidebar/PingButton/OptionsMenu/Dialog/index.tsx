import type { DialogProps } from "@radix-ui/react-dialog";
import { RadioTower } from "lucide-react";
import type { ComponentProps, FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../../../../ui/dialog";
import { CustomTimeIntervalForm } from "./Form";

export function CustomTimeIntervalDialog(
  props: ComponentProps<FC<DialogProps>>,
) {
  return (
    <Dialog {...props}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RadioTower className="size-5" />
            <DialogTitle>Auto Ping</DialogTitle>
          </div>
          <DialogDescription>
            Add custom time duration to ping the server
          </DialogDescription>
        </DialogHeader>
        <CustomTimeIntervalForm onSubmit={() => props.onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  );
}
