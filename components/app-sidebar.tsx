import * as React from "react";
import Link from "next/link";
import { BarChart3, PlusCircle } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  items: [
    {
      title: "Attendance",
      url: "/attendance",
      icon: BarChart3,
    },
    {
      title: "New Attendance",
      url: "/new",
      icon: PlusCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-col h-16 justify-center gap-2 border-b px-4 bg-primary">
        <h1 className="text-lg font-bold text-primary-foreground">MFH</h1>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarMenu>
          {data.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="px-4"
              >
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
