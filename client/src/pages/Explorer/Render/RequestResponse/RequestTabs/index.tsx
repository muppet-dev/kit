import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendHorizonal } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Tool, useTool } from "../../../providers";
import { AnalyseButton } from "./AnalyseButton";
import { GenerateButton } from "./GenerateButton";
import { JSONRender } from "./JSONRender";
import { SchemaRender } from "./SchemaRender";
import { ScoreRender } from "./ScoreRender";
import { ToolRender } from "./ToolRender";
import { RequestTab } from "./constant";
import { AnalyseProvider } from "./providers/analyse";

export type RequestTabs = {
  tabValue: RequestTab;
  onTabValueChange: (value: RequestTab) => void;
};

export function RequestTabs(props: RequestTabs) {
  const { activeTool } = useTool();
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <AnalyseProvider>
      <Tabs
        value={props.tabValue}
        onValueChange={(val) => props.onTabValueChange(val as RequestTab)}
        className="w-full max-h-full overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger
              value={RequestTab.FORM}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
              disabled={activeTool.name === Tool.STATIC_RESOURCES}
            >
              Form
            </TabsTrigger>
            <TabsTrigger
              value={RequestTab.JSON}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
              disabled={activeTool.name === Tool.STATIC_RESOURCES}
            >
              JSON
            </TabsTrigger>
            <TabsTrigger
              value={RequestTab.SCORE}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Score
            </TabsTrigger>
            <TabsTrigger
              value={RequestTab.SCHEMA}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Schema
            </TabsTrigger>
          </TabsList>
          <div className="flex-1" />
          {props.tabValue === RequestTab.SCORE ? (
            <AnalyseButton />
          ) : (
            props.tabValue !== RequestTab.SCHEMA && (
              <>
                {activeTool.name === Tool.TOOLS && <GenerateButton />}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5"
                >
                  {isSubmitting && (
                    <Spinner className="size-4 min-w-4 min-h-4" />
                  )}
                  {isSubmitting ? "Sending" : "Send"}
                  <SendHorizonal />
                </Button>
              </>
            )
          )}
        </div>
        <TabsContent
          value={RequestTab.FORM}
          className="h-full flex flex-col gap-1.5 overflow-y-auto"
        >
          <ToolRender />
        </TabsContent>
        <TabsContent
          value={RequestTab.JSON}
          className="h-full flex flex-col gap-1.5 overflow-y-auto"
        >
          <JSONRender />
        </TabsContent>
        <TabsContent
          value={RequestTab.SCORE}
          className="h-full flex overflow-y-auto"
        >
          <ScoreRender />
        </TabsContent>
        <TabsContent
          value={RequestTab.SCHEMA}
          className="h-full flex overflow-y-auto"
        >
          <SchemaRender />
        </TabsContent>
      </Tabs>
    </AnalyseProvider>
  );
}
