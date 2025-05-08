import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Tool, useTool } from "../../../providers";
import { AnalyseButton } from "./AnalyseButton";
import { GenerateButton } from "./GenerateButton";
import { JSONRender } from "./JSONRender";
import { ScoreRender } from "./ScoreRender";
import { ToolRender } from "./ToolRender";

export type RequestTabs = ToolRender;

export function RequestTabs({ selectedCard, current }: RequestTabs) {
  const { activeTool } = useTool();
  const [selectedTab, setSelectedTab] = useState(
    activeTool.name === Tool.STATIC_RESOURCES ? "score" : "form",
  );
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="w-full max-h-full overflow-y-auto"
    >
      <div className="flex items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger
            value="form"
            className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            disabled={activeTool.name === Tool.STATIC_RESOURCES}
          >
            Form
          </TabsTrigger>
          <TabsTrigger
            value="json"
            className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            disabled={activeTool.name === Tool.STATIC_RESOURCES}
          >
            JSON
          </TabsTrigger>
          <TabsTrigger
            value="score"
            className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            Score
          </TabsTrigger>
        </TabsList>
        <div className="flex-1" />
        {selectedTab === "score" ? (
          <AnalyseButton selected={selectedCard} />
        ) : (
          <>
            {activeTool.name === Tool.TOOLS && (
              <GenerateButton selected={selectedCard} />
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5"
            >
              {isSubmitting && <Spinner className="size-4 min-w-4 min-h-4" />}
              {isSubmitting ? "Sending" : "Send"}
              <SendHorizonal />
            </Button>
          </>
        )}
      </div>
      <TabsContent
        value="form"
        className="h-full flex flex-col gap-1.5 overflow-y-auto"
      >
        <ToolRender current={current} selectedCard={selectedCard} />
      </TabsContent>
      <TabsContent
        value="json"
        className="h-full flex flex-col gap-1.5 overflow-y-auto"
      >
        <JSONRender />
      </TabsContent>
      <TabsContent value="score" className="h-full flex overflow-y-auto">
        <ScoreRender />
      </TabsContent>
    </Tabs>
  );
}
