import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookType, Braces, Gauge, Variable } from "lucide-react";
import { Tool, useTool } from "../../../providers";
import { AnalyseButtonGroup } from "./AnalyseButtonGroup";
import { AnalyseProvider } from "./AnalyseButtonGroup/provider";
import { RequestTab } from "./constant";
import { FormResetButton } from "./FormResetButton";
import { GenerateButtonGroup } from "./GenerateButtonGroup";
import { JSONRender } from "./JSONRender";
import { SchemaRender } from "./SchemaRender";
import { ScoreRender } from "./ScoreRender";
import { SendButton } from "./SendButton";
import { ToolRender } from "./ToolRender";

export type RequestTabs = {
  tabValue: RequestTab;
  onTabValueChange: (value: RequestTab) => void;
};

export function RequestTabs(props: RequestTabs) {
  const { activeTool } = useTool();

  return (
    <AnalyseProvider>
      <Tabs
        value={props.tabValue}
        onValueChange={(val) => props.onTabValueChange(val as RequestTab)}
        className="w-full max-h-full overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <TabsList>
            <TabsTrigger
              value={RequestTab.FORM}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
              disabled={activeTool.name === Tool.STATIC_RESOURCES}
            >
              <p className="xl:flex hidden">Form</p>
              <BookType className="xl:hidden" />
            </TabsTrigger>
            <TabsTrigger
              value={RequestTab.JSON}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
              disabled={activeTool.name === Tool.STATIC_RESOURCES}
            >
              <p className="xl:flex hidden">JSON</p>
              <Braces className="xl:hidden" />
            </TabsTrigger>
            <TabsTrigger
              value={RequestTab.SCORE}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              <p className="xl:flex hidden">Score</p>
              <Gauge className="xl:hidden" />
            </TabsTrigger>
            <TabsTrigger
              value={RequestTab.SCHEMA}
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              <p className="xl:flex hidden">Schema</p>
              <Variable className="xl:hidden" />
            </TabsTrigger>
          </TabsList>
          <div className="flex-1" />
          {props.tabValue === RequestTab.SCORE ? (
            <AnalyseButtonGroup />
          ) : (
            props.tabValue !== RequestTab.SCHEMA && (
              <>
                <FormResetButton />
                {activeTool.name === Tool.TOOLS && <GenerateButtonGroup />}
                <SendButton />
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
