import { cn } from "@/client/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { BaseSyntheticEvent, PropsWithChildren } from "react";

export type ItemCard = {
  isSelected: boolean;
  onClick: (event: BaseSyntheticEvent) => void;
  icon?: LucideIcon;
  name: string;
  className?: string;
};

export function ItemCard({
  isSelected,
  name,
  onClick,
  icon: Icon,
  children,
  className,
}: PropsWithChildren<ItemCard>) {
  return (
    <div
      className={cn(
        "px-4 py-[8px] border text-muted-foreground leading-none cursor-pointer hover:bg-accent/60 hover:border-primary/30 transition-all ease-in-out flex items-center gap-2 w-full justify-center",
        isSelected && "bg-accent/60 border-primary/30 text-foreground",
        className
      )}
      onClick={onClick}
      onKeyDown={onClick}
    >
      {Icon && <Icon className="stroke-2 size-4" />}
      {name}
      {children}
    </div>
  );
}
