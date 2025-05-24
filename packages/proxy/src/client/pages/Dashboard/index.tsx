import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Skeleton } from "@/client/components/ui/skeleton";
import { cn } from "@/client/lib/utils";
import { useStats } from "@/client/queries/useStats";
import {
  Database,
  Layers,
  type LucideProps,
  Plus,
  Server,
  Users,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Link } from "react-router";

const ITEMS: Pick<DashboardCard, "icon" | "title" | "theme">[] = [
  {
    title: "Servers",
    icon: Server,
    theme: "blue",
  },
  {
    title: "Tools",
    icon: Layers,
    theme: "purple",
  },
  {
    title: "Prompts",
    icon: Users,
    theme: "green",
  },
  {
    title: "Resources",
    icon: Database,
    theme: "orange",
  },
];

export default function DashboardPage() {
  const { data, isLoading, isError } = useStats();

  return (
    <div className="p-4 size-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="flex gap-4">
        {ITEMS.map((item) => (
          <DashboardCard
            key={item.title}
            title={`Total ${item.title}`}
            icon={item.icon}
            theme={item.theme}
            stat={data?.[item.title.toLowerCase()]}
            isLoading={isLoading}
            isError={isError}
          />
        ))}
      </div>
      <AddServerCard />
    </div>
  );
}

const iconBackground = {
  blue: "bg-blue-100/80 dark:bg-blue-500/10",
  purple: "bg-purple-100/80 dark:bg-purple-500/10",
  green: "bg-green-100/80 dark:bg-green-500/10",
  orange: "bg-orange-100/80 dark:bg-orange-500/10",
};
const iconStroke = {
  blue: "stroke-blue-500 dark:stroke-blue-300",
  purple: "stroke-purple-500 dark:stroke-purple-300",
  green: "stroke-green-500 dark:stroke-green-300",
  orange: "stroke-orange-500 dark:stroke-orange-300",
};

type DashboardCard = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  theme: "blue" | "purple" | "green" | "orange";
  stat?: number;
  isLoading?: boolean;
  isError?: boolean;
};

function DashboardCard(props: DashboardCard) {
  const Icon = props.icon;

  return (
    <Card className="w-80">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="tracking-tight text-sm font-medium text-muted-foreground">
          {props.title}
        </CardTitle>
        <div className={cn("p-2", iconBackground[props.theme])}>
          <Icon className={cn("size-4", iconStroke[props.theme])} />
        </div>
      </CardHeader>
      <CardContent>
        {props.isLoading ? (
          <Skeleton className="w-10 h-8" />
        ) : !props.isError ? (
          <p className="text-2xl font-bold tracking-tight">
            {props.stat != null ? props.stat : "-"}
          </p>
        ) : (
          <p className="font-medium tracking-tight text-destructive">Error</p>
        )}
      </CardContent>
    </Card>
  );
}

function AddServerCard() {
  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900">
            <Server className="size-5 stroke-blue-500 dark:stroke-blue-400" />
          </div>
          <h3 className="font-semibold tracking-tight text-lg">Add Server</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Register a new MCP server to your registry
        </p>
      </CardHeader>
      <CardContent>
        <Link to="/servers/add">
          <Button className="w-full">
            <Plus />
            Add Server
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
