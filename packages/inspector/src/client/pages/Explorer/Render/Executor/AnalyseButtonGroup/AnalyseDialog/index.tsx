import { Settings, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../components/ui/dialog";
import { AnalyseForm } from "./Form";

export function AnalyseDialog() {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          colorScheme="secondary"
          className="size-max has-[>svg]:px-2.5 py-2.5 rounded-l-none"
        >
          <Settings className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <DialogTitle>Analyse</DialogTitle>
          </div>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <AnalyseForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
