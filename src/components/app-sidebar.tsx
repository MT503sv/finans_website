"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs" 
import Image from "next/image"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter, 
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "My business",
      url: "#",
      items: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Overview", url: "/overview" },
        { title: "AI Reports", url: "/reports" },
      ],
    },
    {
      title: "Management",
      url: "#",
      items: [
        { title: "Inventory", url: "/inventory" },
        { title: "Budgets", url: "/budgets" }, 
        { title: "My Goals", url: "/goals" },
      ],
    },
    {
      title: "Tools",
      url: "#",
      items: [
        { title: "AI chat", url: "/ai-chat" },
        { title: "Scanner", url: "/scanner" },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        { title: "About Us", url: "/about" },
        { title: "FAQs", url: "/faqs" },
      ],
    },
    {
      title: "Premium",
      url: "#",
      items: [
        { title: "Get Premium", url: "/premium" },
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-gray-200" {...props}>
      <SidebarHeader className="h-14 flex justify-center bg-white border-b border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent transition-none">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square items-center justify-center rounded-lg relative w-[40px] h-[40px]">
                  <Image 
                    src="/logos/imagotipo-finans2.png" 
                    alt="Finly Logo" 
                    fill
                    priority
                    loading="eager"
                    className="object-contain"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <span className="font-semibold text-[#010221]/90 px-2 cursor-default select-none">
                    {item.title}
                  </span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="border-l border-gray-100 ml-4 space-y-1">
                    {item.items.map((subItem) => {
                      const isActive = pathname === subItem.url;
                      
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isActive}
                            className={`transition-none duration-0 relative group ${
                              isActive 
                                ? "bg-[#010221]/5 text-[#010221] font-bold border-r-2 border-[#010221]" 
                                : "text-gray-500 hover:text-[#010221] hover:bg-gray-50"
                            }`}
                          >
                         
                            <Link href={subItem.url} scroll={false}>
                              {subItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-white p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-1 py-1.5 text-left text-sm">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8"
                  }
                }}
              />
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold text-[#010221]">My account</span>
                <span className="truncate text-xs text-gray-400 font-medium">Settings</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
