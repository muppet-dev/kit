import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormRender } from "./FormRender";
import { cn } from "@/lib/utils";
import { CodeHighlighter } from "@/components/Hightlighter";

const CARDS: { name: string; description: string }[] = [
  {
    name: "Sample Card 1",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 2",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 3",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 4",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 5",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 6",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 7",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 8",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 9",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
  {
    name: "Sample Card 10",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur reprehenderit maxime expedita omnis ipsa quia, iste quae provident beatae voluptas.",
  },
];

export function ScannerPage() {
  return (
    <div className="size-full grid grid-cols-2 overflow-y-auto">
      <div className="p-4 overflow-y-auto">
        <div className="flex flex-col">
          {CARDS.map((card, index) => (
            <Card
              key={`card.${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              className={cn(
                index === 0
                  ? "bg-white"
                  : "bg-transparent hover:bg-white transition-all ease-in-out",
                "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max"
              )}
            >
              {index === 0 && (
                <div className="h-full w-1 bg-primary absolute left-0 top-0" />
              )}
              <CardHeader className="px-4 -mb-1">
                <CardTitle className="text-sm font-normal">
                  {card.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <CardDescription className="line-clamp-1 leading-tight tracking-tight">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex">
        <Tabs defaultValue="form" className="size-full">
          <TabsList>
            <TabsTrigger
              value="form"
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5"
            >
              Form
            </TabsTrigger>
            <TabsTrigger
              value="json"
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5"
            >
              JSON
            </TabsTrigger>
            <TabsTrigger
              value="score"
              className="data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-primary cursor-pointer py-2 px-5"
            >
              Score
            </TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <FormRender />
          </TabsContent>
          <TabsContent value="json">
            <CodeHighlighter
              content="{
                'name':'sample',
                'description': 'sample description'
              }"
            />
          </TabsContent>
          <TabsContent value="score">Score</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
