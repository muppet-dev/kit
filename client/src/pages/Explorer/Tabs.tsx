import {
  TabsList,
  Tabs as TabsPrimitive,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTool } from "./tools";

export function Tabs() {
  const { tools, activeTool, changeTool } = useTool();
  return (
    <TabsPrimitive
      defaultValue={activeTool.name}
      onValueChange={(value) => changeTool(value)}
      className="w-full px-4"
    >
      <TabsList className="w-full p-0 bg-background justify-start gap-4 text-md border-b rounded-none">
        {tools.map((tab) => (
          <TabsTrigger
            key={tab.name}
            value={tab.name}
            disabled={!tab.enabled}
            className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary dark:data-[state=active]:border-input/0 dark:data-[state=active]:border-b-foreground dark:data-[state=active]:bg-transparent max-w-max"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsPrimitive>
  );
}
