import {
  Tabs as TabsPrimitive,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTool } from "@/providers";

export function Tabs() {
  const { tools, activeTool } = useTool();
  return (
    <TabsPrimitive defaultValue={activeTool.name} className="max-w-xs w-full">
      <TabsList className="w-full p-0 bg-background justify-start gap-4 text-md">
        {tools.map((tab) => (
          <TabsTrigger
            key={tab.name}
            value={tab.name}
            disabled={!tab.enabled}
            className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsPrimitive>
  );
}
