"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ArenaSidebarContent } from "@/components/arena/ArenaSidebarContent";
import { ArenaSidebarFooter } from "@/components/arena/ArenaSidebarFooter";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-transparent cursor-default"
              size="lg"
              asChild
            >
              <Link href="/">
                <div className="bg-primary text-secondary flex aspect-square size-8 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full dark:invert"
                    src={"/icon.svg"}
                    alt="AI Arena"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">AI Arena</span>
                  <span className="truncate text-xs text-muted-foreground">
                    AI Model Arena
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ArenaSidebarContent />
      </SidebarContent>
      <SidebarFooter className="p-0">
        <ArenaSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
