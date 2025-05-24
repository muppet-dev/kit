import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { cn } from "@/client/lib/utils";
import {
  Database,
  Layers,
  type LucideProps,
  Plus,
  Server,
  Users,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export default function DashboardPage() {
  return (
    <div className="p-4 size-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-4 gap-4">
        <DashboardCard
          title="Total Servers"
          icon={Server}
          stat={12}
          theme="blue"
        />
        <DashboardCard
          title="Total Tools"
          icon={Layers}
          stat={8}
          theme="purple"
        />
        <DashboardCard
          title="Total Prompts"
          icon={Users}
          stat={24}
          theme="green"
        />
        <DashboardCard
          title="Total Resources"
          icon={Database}
          stat={142}
          theme="orange"
        />
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900">
                <Server className="size-5 stroke-blue-500 dark:stroke-blue-400" />
              </div>
              <h3 className="font-semibold tracking-tight text-lg">
                Add Server
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Register a new MCP server to your registry
            </p>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus />
              Add Server
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const iconBackground = {
  blue: "bg-blue-100 dark:bg-blue-900",
  purple: "bg-purple-100 dark:bg-purple-900",
  green: "bg-green-100 dark:bg-green-900",
  orange: "bg-orange-100 dark:bg-orange-900",
};
const iconStroke = {
  blue: "stroke-blue-500 dark:stroke-blue-400",
  purple: "stroke-purple-500 dark:stroke-purple-400",
  green: "stroke-green-500 dark:stroke-green-400",
  orange: "stroke-orange-500 dark:stroke-orange-400",
};

type DashboardCard = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  theme: "blue" | "purple" | "green" | "orange";
  stat: number;
};

function DashboardCard(props: DashboardCard) {
  const Icon = props.icon;
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="tracking-tight text-sm font-medium text-muted-foreground">
          {props.title}
        </CardTitle>
        <div className={cn("p-2", iconBackground[props.theme])}>
          <Icon className={cn("size-4", iconStroke[props.theme])} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{props.stat}</p>
      </CardContent>
    </Card>
  );
}
