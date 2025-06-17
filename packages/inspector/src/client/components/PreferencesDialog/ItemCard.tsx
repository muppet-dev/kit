import { cn } from "@/client/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, PropsWithChildren } from "react";

export type ItemCard = {
  isSelected: boolean;
  icon?: LucideIcon;
  name: string;
} & Pick<ComponentProps<"div">, "className" | "onClick" | "onKeyDown">;

export function ItemCard({
  isSelected,
  name,
  icon: Icon,
  children,
  className,
  ...props
}: PropsWithChildren<ItemCard>) {
  return (
    <div
      {...props}
      className={cn(
        "px-4 py-2 border text-muted-foreground leading-none cursor-pointer hover:bg-accent/60 hover:border-primary/30 transition-all ease-in-out flex items-center gap-2 w-full justify-center rounded-md",
        isSelected && "bg-accent/60 border-primary/30 text-foreground",
        className,
      )}
    >
      {Icon && <Icon className="stroke-2 size-4" />}
      {name}
      {children}
    </div>
  );
}
