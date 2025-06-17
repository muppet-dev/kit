import type * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  AlignJustify,
  Braces,
  Gauge,
  type LucideProps,
  Variable,
} from "lucide-react";
import {
  type ComponentProps,
  type ForwardRefExoticComponent,
  type RefAttributes,
  useEffect,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { cn } from "../../../../lib/utils";
import { useConfig } from "../../../../providers";
import { Tool, useMCPItem, useTool } from "../../providers";
import { AnalyseButtonGroup } from "./AnalyseButtonGroup";
import { AnalysePanel } from "./AnalysePanel";
import { FormPanel } from "./FormPanel";
import { FormResetButton } from "./FormResetButton";
import { GenerateButtonGroup } from "./GenerateButtonGroup";
import { JSONPanel } from "./JSONPanel";
import { ReponsePanel } from "./Response";
import { SchemaPanel } from "./SchemaPanel";
import { SendButton } from "./SendButton";
import { RequestTab } from "./constant";
import { CustomFormProvider } from "./provider";

export function Executor() {
  const { isModelsEnabled } = useConfig();
  const { activeTool } = useTool();
  const { selectedItem } = useMCPItem();
  const [isExpanded, setExpanded] = useState(false);

  const methods = useForm();

  const [selectedTab, setSelectedTab] = useState<RequestTab>(RequestTab.FORM);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    methods.reset({ __reset: true });

    setSelectedTab((prev) =>
      activeTool.name === Tool.STATIC_RESOURCES && prev === RequestTab.JSON
        ? RequestTab.FORM
        : prev,
    );
  }, [activeTool]);

  if (!selectedItem)
    return (
      <div className="bg-background flex items-center justify-center size-full select-none text-muted-foreground lg:col-span-3">
        <p className="text-sm">Select a {activeTool.label}</p>
      </div>
    );

  return (
    <CustomFormProvider>
      <FormProvider {...methods}>
        <Tabs
          value={selectedTab}
          onValueChange={(val) => setSelectedTab(val as RequestTab)}
          className="lg:pl-4 overflow-y-auto flex flex-col w-full bg-background lg:border-l lg:py-4 py-2 lg:col-span-3"
        >
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            <TabsList>
              <TabsTriggerComponent
                value={RequestTab.FORM}
                label="Form"
                icon={AlignJustify}
              />
              <TabsTriggerComponent
                value={RequestTab.JSON}
                label="JSON"
                icon={Braces}
                disabled={activeTool.name === Tool.STATIC_RESOURCES}
              />
              {isModelsEnabled && (
                <TabsTriggerComponent
                  value={RequestTab.SCORE}
                  label="Score"
                  icon={Gauge}
                />
              )}
              <TabsTriggerComponent
                value={RequestTab.SCHEMA}
                label="Schema"
                icon={Variable}
              />
            </TabsList>
            <div className="flex-1" />
            {selectedTab === RequestTab.SCORE ? (
              <AnalyseButtonGroup />
            ) : (
              selectedTab !== RequestTab.SCHEMA && (
                <>
                  {activeTool.name !== Tool.STATIC_RESOURCES && (
                    <FormResetButton />
                  )}
                  {activeTool.name === Tool.TOOLS && <GenerateButtonGroup />}
                  <SendButton />
                </>
              )
            )}
          </div>
          {(selectedTab === RequestTab.FORM ||
            selectedTab === RequestTab.JSON) && (
            <div className="flex-1 h-full flex flex-col overflow-y-auto">
              {selectedTab === RequestTab.FORM && (
                <div
                  className={cn(
                    "flex-1 flex overflow-y-auto",
                    !isExpanded && "min-h-1/2 h-full",
                  )}
                >
                  <FormPanel />
                </div>
              )}
              {selectedTab === RequestTab.JSON && (
                <div
                  className={cn(
                    "flex-1 flex flex-col gap-1.5 overflow-y-auto",
                    !isExpanded && "min-h-1/2 h-full",
                  )}
                >
                  <JSONPanel />
                </div>
              )}
              <ReponsePanel
                isExpanded={isExpanded}
                onExpandChange={setExpanded}
              />
            </div>
          )}
          <TabsContent
            value={RequestTab.SCORE}
            className="h-full flex overflow-y-auto"
          >
            <AnalysePanel />
          </TabsContent>
          <TabsContent
            value={RequestTab.SCHEMA}
            className="h-full flex overflow-y-auto"
          >
            <SchemaPanel />
          </TabsContent>
        </Tabs>
      </FormProvider>
    </CustomFormProvider>
  );
}

type TabsTriggerComponent = Omit<
  ComponentProps<typeof TabsPrimitive.Trigger>,
  "value"
> & {
  value: RequestTab;
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

function TabsTriggerComponent({
  icon: Icon,
  label,
  className,
  ...props
}: TabsTriggerComponent) {
  return (
    <TabsTrigger
      {...props}
      className={cn(
        "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-2 xl:px-5 dark:data-[state=active]:bg-foreground dark:data-[state=active]:text-background",
        className,
      )}
    >
      <p className="xl:flex hidden">{label}</p>
      <Icon className="xl:hidden" />
    </TabsTrigger>
  );
}
