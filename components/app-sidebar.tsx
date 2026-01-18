import * as React from "react";
import Link from "next/link";

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
    },
    {
      title: "New Attendance",
      url: "/new",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-col h-16 justify-center gap-2 border-b px-4">
        <p>LOGO</p>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        {/* We create a SidebarGroup for each parent. */}
        <SidebarMenu>
          {data.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                // isActive={item.isActive}
                className="px-4"
              >
                <Link href={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
