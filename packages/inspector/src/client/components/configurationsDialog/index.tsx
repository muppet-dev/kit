import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ConfigTabs } from "./Tabs";

export function ConfigurationsDialog() {
  return (
    <Dialog open={true}>
      <DialogContent isClosable={false} className="h-[580px] flex flex-col">
        <DialogHeader className="gap-0 h-max">
          <DialogTitle>Configure Transport</DialogTitle>
          <DialogDescription>
            Please configure the transport settings to continue
          </DialogDescription>
        </DialogHeader>
        <ConfigTabs />
      </DialogContent>
    </Dialog>
  );
}
