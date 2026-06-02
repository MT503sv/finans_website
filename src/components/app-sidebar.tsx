"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  FileBarChart2,
  Package,
  Target,
  Bot,
  ScanLine,
  Star,
  LucideIcon,
} from "lucide-react"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  section: string
}

const data: NavItem[] = [
  { section: "My business", title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { section: "My business", title: "Inventory", url: "/inventory", icon: Package },
  { section: "My business", title: "My Goals", url: "/goals", icon: Target },
  { section: "Tracking", title: "Sales", url: "/sales", icon: FileBarChart2 },  
  { section: "Tracking", title: "Incomes", url: "/incomes", icon: FileBarChart2 },
  { section: "Tracking", title: "Expenses", url: "/expenses", icon: FileBarChart2 },
  { section: "Tracking", title: "Debts", url: "/debts", icon: FileBarChart2 },
  { section: "Tools", title: "AI chat", url: "/ai-chat", icon: Bot },
  { section: "Tools", title: "Scanner", url: "/ocr", icon: ScanLine },
  { section: "Tools", title: "AI Reports", url: "/reports", icon: FileBarChart2 },
  { section: "Premium", title: "Get Premium", url: "/plans", icon: Star },
]

const grouped = data.reduce<Record<string, NavItem[]>>((acc, item) => {
  if (!acc[item.section]) acc[item.section] = []
  acc[item.section].push(item)
  return acc
}, {})

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onPin?: () => void
  pinned?: boolean
}

export function AppSidebar({ onMouseEnter, onMouseLeave, onPin, pinned, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
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
                    <div className="relative h-[36px] w-[90px] group-data-[collapsible=icon]:w-[32px] transition-all duration-200">
                      <Image
                        src="/logos/finans-imagotipo-2.png"
                        alt="Finans Logo"
                        fill
                        priority
                        loading="eager"
                        className="object-contain group-data-[collapsible=icon]:hidden"
                      />
                      <Image
                        src="/logos/finans-image-2.png"
                        alt="Finans Logo"
                        fill
                        priority
                        loading="eager"
                        className="object-contain hidden group-data-[collapsible=icon]:block"
                      />
                    </div>
                  </Link>

                  <button
                    onClick={onPin}
                    className="ml-auto p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer group-data-[collapsible=icon]:hidden"
                    title={pinned ? "Unpin sidebar" : "Pin sidebar"}
                  >
                    {pinned ? (
                      <PanelLeftClose className="h-4 w-4 text-[#010221]" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4 text-gray-400 hover:text-[#010221]" />
                    )}
                  </button>

                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="bg-white">
          {Object.entries(grouped).map(([section, items]) => (
            <SidebarGroup key={section}>
              <p className="font-semibold text-[#010221]/90 px-4 py-1 text-sm select-none group-data-[collapsible=icon]:hidden">
                {section}
              </p>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={`transition-none duration-0 ${
                              isActive
                                ? "bg-[#010221]/5 text-[#010221] font-bold"
                                : "text-gray-500 hover:text-[#010221] hover:bg-gray-50"
                            }`}
                          >
                            <Link href={item.url} scroll={false} className="flex items-center gap-2">
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="group-data-[collapsible=icon]:block hidden">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-100 bg-white p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-3 px-1 py-1.5 text-left text-sm group-data-[collapsible=icon]:justify-center">
                <UserButton
                  appearance={{
                    elements: { userButtonAvatarBox: "size-8" }
                  }}
                />
                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-[#010221]">My account</span>
                  <span className="truncate text-xs text-gray-400 font-medium">Settings</span>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}
