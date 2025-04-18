import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormRender } from "./FormRender";
import { JSONRender } from "./JSONRender";

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
  const [current, setCurrent] = useState<number>(0);

  const onClick = (index: number) => setCurrent(index);

  return (
    <div className="size-full flex overflow-y-auto">
      <div className="overflow-y-auto w-full">
        <div className="flex flex-col">
          {CARDS.map((card, index) => (
            <Card
              key={`card.${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              className={cn(
                index === current
                  ? "bg-white"
                  : "bg-transparent hover:bg-white transition-all ease-in-out",
                "relative gap-0 py-2 shadow-none border-0 first-of-type:border-t border-b rounded-none select-none cursor-pointer h-max"
              )}
              onClick={() => onClick(index)}
              onKeyDown={() => onClick(index)}
            >
              {index === current && (
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
      <div className="px-4 overflow-y-auto flex w-full bg-white border-l">
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
            <JSONRender />
          </TabsContent>
          <TabsContent value="score">Score</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
