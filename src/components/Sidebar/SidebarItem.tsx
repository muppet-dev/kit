import {
  SidebarGroup,
  SidebarMenu,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

export type SidebarItem = {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
};

export function SidebarItem({ items }: SidebarItem) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <NavLink
              to={item.url}
              className={({ isActive }) =>
                cn(
                  sidebarMenuButtonVariants(),
                  isActive &&
                    "bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground"
                )
              }
            >
              <item.icon />
              <span>{item.name}</span>
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
