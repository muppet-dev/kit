import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { NavLink } from "react-router";
import { cn } from "../../lib/utils";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  sidebarMenuButtonVariants,
  useSidebar,
} from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type SidebarItem = {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
};

export function SidebarItem({ items }: SidebarItem) {
  const { state } = useSidebar();

  const ToolTipWrapper = (props: PropsWithChildren<{ name: string }>) => {
    if (state === "collapsed")
      return (
        <Tooltip>
          <TooltipTrigger>{props.children}</TooltipTrigger>
          <TooltipContent side="right">{props.name}</TooltipContent>
        </Tooltip>
      );

    return <>{props.children}</>;
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <ToolTipWrapper key={item.name} name={item.name}>
            <SidebarMenuItem>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  cn(
                    sidebarMenuButtonVariants(),
                    isActive &&
                      "bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground",
                  )
                }
              >
                <item.icon />
                <span>{item.name}</span>
              </NavLink>
            </SidebarMenuItem>
          </ToolTipWrapper>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
