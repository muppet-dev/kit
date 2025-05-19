import { useConfig } from "../../providers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { ConfigTabs } from "./Tabs";

export function ConfigurationsDialog() {
  const { version } = useConfig();

  return (
    <Dialog open={true}>
      <DialogOverlay>
        <div className="absolute bottom-2 right-2">
          <p>{version}</p>
        </div>
      </DialogOverlay>
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
