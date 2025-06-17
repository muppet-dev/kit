import { ListX } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { eventHandler } from "../../lib/eventHandler";
import { useConnection, useNotification } from "../../providers";
import { DownloadButton } from "./DownloadButton";
import { TracingTable } from "./Table";
import { HistoryProvider, HistoryTab, useHistory } from "./providers";

export default function HistoryPage() {
  return (
    <HistoryProvider>
      <HistoryPanel />
    </HistoryProvider>
  );
}

function HistoryPanel() {
  const { tab, changeTab } = useHistory();

  return (
    <div className="p-4 size-full">
      <Tabs
        value={tab.value}
        onValueChange={(value) => changeTab(value as HistoryTab)}
        className="size-full"
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger
              value={HistoryTab.HISTORY}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value={HistoryTab.NOTIFICATIONS}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value={HistoryTab.ERRORS}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background"
            >
              Errors
            </TabsTrigger>
          </TabsList>
          <PageHeader />
        </div>
        <div className="size-full flex flex-col gap-4 overflow-y-auto">
          <TracingTable />
        </div>
      </Tabs>
    </div>
  );
}

function PageHeader() {
  const { tab } = useHistory();
  const { clearNotifications, clearStdErrNotifications } = useNotification();
  const { setRequestHistory } = useConnection();

  const onClear = eventHandler(() => {
    switch (tab.value) {
      case HistoryTab.HISTORY:
        setRequestHistory([]);
        break;
      case HistoryTab.NOTIFICATIONS:
        clearNotifications();
        break;
      case HistoryTab.ERRORS:
        clearStdErrNotifications();
        break;
    }
  });

  return (
    <div className="flex gap-2 items-center">
      <DownloadButton />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-max has-[>svg]:px-1.5 py-1.5"
            onClick={onClear}
            onKeyDown={onClear}
          >
            <ListX className="size-4 stroke-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Clear all traces</TooltipContent>
      </Tooltip>
    </div>
  );
}
