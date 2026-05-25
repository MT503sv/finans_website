"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { PanelLeftClose } from "lucide-react"
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
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  FileBarChart2,
  Package,
  Calculator,
  Target,
  Bot,
  ScanLine,
  Info,
  HelpCircle,
  Star,
  LucideIcon,
} from "lucide-react"

interface NavSubItem {
  title: string
  url: string
  icon: LucideIcon
}

interface NavItem {
  title: string
  url: string
  items: NavSubItem[]
}

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "My business",
      url: "#",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "AI Reports", url: "/reports", icon: FileBarChart2 },
      ],
    },
    {
      title: "Management",
      url: "#",
      items: [
        { title: "Inventory", url: "/inventory", icon: Package },
        { title: "Budgets", url: "/budgets", icon: Calculator },
        { title: "My Goals", url: "/goals", icon: Target },
      ],
    },
    {
      title: "Tools",
      url: "#",
      items: [
        { title: "AI chat", url: "/ai-chat", icon: Bot },
        { title: "Scanner", url: "/ocr", icon: ScanLine },
      ],
    },
    {
      title: "Community",
      url: "#",
      items: [
        { title: "About Us", url: "/about", icon: Info },
        { title: "FAQs", url: "/faqs", icon: HelpCircle },
      ],
    },
    {
      title: "Premium",
      url: "#",
      items: [
        { title: "Get Premium", url: "/plans", icon: Star },
      ],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onPin?: () => void
  pinned?: boolean
}

export function AppSidebar({ onMouseEnter, onMouseLeave, onPin, pinned, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar
      className="border-r border-gray-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      <SidebarHeader className="h-[57px] flex justify-center bg-white border-b border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent transition-none">
              <div className="flex items-center justify-between w-full px-1">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="flex items-center justify-center relative w-[90px] h-[40px] mx-1">
                    <Image
                      src="/logos/finans-imagotipo-2.png"
                      alt="Finans Logo"
                      fill
                      priority
                      loading="eager"
                      className="object-contain"
                    />
                  </div>
                </Link>

                {/* Botón de fijar — solo visible cuando está abierto por hover */}
                {!pinned && (
                  <button
                    onClick={onPin}
                    className="ml-auto p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-[#010221] transition-colors cursor-pointer"
                    title="Pin sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                )}

                {/* Botón de desfijar — visible cuando está pinned */}
                {pinned && (
                  <button
                    onClick={onPin}
                    className="ml-auto p-1 rounded hover:bg-gray-100 text-[#010221] transition-colors"
                    title="Unpin sidebar"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                )}
              </div>
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
                      const isActive = pathname === subItem.url
                      const Icon = subItem.icon

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                            className={`transition-none duration-0 relative group ${
                              isActive
                                ? "bg-[#010221]/5 text-[#010221] font-bold"
                                : "text-gray-500 hover:text-[#010221] hover:bg-gray-50"
                            }`}
                          >
                            <Link href={subItem.url} scroll={false} className="flex items-center gap-2">
                              <Icon className="h-4 w-4 shrink-0" />
                              {subItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
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
                  elements: { userButtonAvatarBox: "size-8" }
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
    </Sidebar>
  )
}
