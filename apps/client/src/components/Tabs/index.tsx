import { Tabs as TabsPrimitive, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    name: "Prompts",
    value: "prompts",
    content: <div>prompts</div>,
  },
  {
    name: "Tools",
    value: "tools",
    content: <div>tools</div>,
  },
  {
    name: "Resources",
    value: "resources",
    content: <div>resources</div>,
  },
];

export function Tabs() {
  return (
    <TabsPrimitive defaultValue={tabs[0].value} className="max-w-xs w-full">
      <TabsList className="w-full p-0 bg-background justify-start gap-4 text-md">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsPrimitive>
  );
}
