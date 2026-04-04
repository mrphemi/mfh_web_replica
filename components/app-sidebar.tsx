"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart3, LogOut, PlusCircle, Zap } from "lucide-react";
import type { User } from "@auth0/nextjs-auth0/types";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Attendance",
    url: "/attendance",
    icon: BarChart3,
  },
];

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-sidebar-accent/60 data-[slot=sidebar-menu-button]:p-2!"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Zap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    MFH
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/50">
                    Attendance
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-1.5">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="New Attendance"
                  className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/85 hover:text-sidebar-primary-foreground active:bg-sidebar-primary/85 min-w-8 duration-150 ease-linear font-medium"
                >
                  <Link href="/new" onClick={handleLinkClick}>
                    <PlusCircle />
                    <span>New Attendance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator />

            <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase tracking-widest text-[10px]">
              Menu
            </SidebarGroupLabel>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-sidebar-foreground/80 hover:text-sidebar-accent-foreground"
                  >
                    <Link href={item.url} onClick={handleLinkClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent/60">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-primary text-xs font-bold">
                {user.email?.[0].toUpperCase() ?? "?"}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs text-sidebar-foreground/45">
                  {user.email}
                </span>
              </div>
              <a href="/auth/logout" title="Log out">
                <LogOut className="size-4 text-sidebar-foreground/45 hover:text-sidebar-foreground" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
