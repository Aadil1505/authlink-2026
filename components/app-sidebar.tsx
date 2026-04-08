"use client"

import * as React from "react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  PackageIcon,
  NfcIcon,
  ShieldCheckIcon,
  KeyRoundIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  BookOpenIcon,
  ActivityIcon,
} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
      items: [],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: <PackageIcon />,
      items: [
        { title: "All Products", url: "/dashboard/products" },
        { title: "Register Product", url: "/dashboard/products/new" },
      ],
      isActive: true,

    },
    {
      title: "NFC Tags",
      url: "/dashboard/tags",
      icon: <NfcIcon />,
      items: [
        { title: "All Tags", url: "/dashboard/tags" },
        { title: "Personalize Tag", url: "/dashboard/tags/personalize" },
      ],
      isActive: true,
    },
    {
      title: "Verifications",
      url: "/dashboard/verifications",
      icon: <ShieldCheckIcon />,
      items: [
        { title: "Scan Logs", url: "/dashboard/verifications" },
        { title: "Verify a Tag", url: "/check" },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: <ActivityIcon />,
      items: [
        { title: "Scan Activity", url: "/dashboard/analytics" },
        { title: "Geography", url: "/dashboard/analytics/geography" },
      ],
    },
    {
      title: "API Keys",
      url: "/dashboard/api-keys",
      icon: <KeyRoundIcon />,
      items: [],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2Icon />,
      items: [
        { title: "Account", url: "/dashboard/settings" },
        { title: "Billing", url: "/dashboard/settings/billing" },
        { title: "Blockchain", url: "/dashboard/settings/blockchain" },
      ],
    },
    {
      title: "Documentation",
      url: "/dashboard/docs",
      icon: <BookOpenIcon />,
      items: [
        { title: "Getting Started", url: "/dashboard/docs" },
        { title: "API Reference", url: "/dashboard/docs/api" },
        { title: "Partner Integration", url: "/dashboard/docs/partners" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                  <Image
                    src="/web-app-manifest-192x192.png"
                    alt="Authlink logo"
                    width={20}
                    height={20}
                    className="dark:invert"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold font-heading">Authlink</span>
                  <span className="truncate text-xs">Manufacturer Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
