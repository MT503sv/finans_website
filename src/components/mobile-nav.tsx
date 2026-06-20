'use client'

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { X, Menu, LayoutDashboard, FileBarChart2, Package, Target, Bot, ScanLine, Star, LucideIcon } from "lucide-react"

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  { ssr: false }
)


interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  section: string
}

const data: NavItem[] = [
  { section: "My business", title: "Dashboard",  url: "/dashboard", icon: LayoutDashboard },
  { section: "My business", title: "My Goals",   url: "/goals",     icon: Target },
  { section: "Tracking",    title: "Sales",      url: "/sales",     icon: FileBarChart2 },
  { section: "Tracking",    title: "Incomes",    url: "/incomes",   icon: FileBarChart2 },
  { section: "Tracking",    title: "Expenses",   url: "/expenses",  icon: FileBarChart2 },
  { section: "Tracking",    title: "Debts",      url: "/debts",     icon: FileBarChart2 },
  { section: "Tools",       title: "AI chat",    url: "/kuali",   icon: Bot },
  { section: "Tools",       title: "Scanner",    url: "/ocr",       icon: ScanLine },
  { section: "Tools",       title: "Reports", url: "/report",   icon: FileBarChart2 },
  { section: "Premium",     title: "Get Premium",url: "/plans",     icon: Star },
]

const grouped = data.reduce<Record<string, NavItem[]>>((acc, item) => {
  if (!acc[item.section]) acc[item.section] = []
  acc[item.section].push(item)
  return acc
}, {})

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Top navbar */}
      <header className="h-[57px] flex items-center justify-between px-4 bg-white border-b border-gray-200">
        <Link href="/dashboard">
          <div className="relative h-[32px] w-[85px]">
            <Image
              src="/logos/finans-imagotipo-2.png"
              alt="Finans Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "size-8" } }} />
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-[#010221]" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Drawer header */}
        <div className="h-[57px] flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <div className="relative h-[32px] w-[85px]">
              <Image
                src="/logos/finans-imagotipo-2.png"
                alt="Finans Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-[#010221]" />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 overflow-y-auto py-4">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="mb-4">
              <p className="text-xs font-semibold text-[#010221]/50 uppercase tracking-wider px-4 py-2">
                {section}
              </p>
              <ul>
                {items.map((item) => {
                  const isActive = pathname === item.url
                  const Icon = item.icon
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.url}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-[#010221]/5 text-[#010221] font-bold"
                            : "text-gray-500 hover:text-[#010221] hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "size-8" } }} />
            <div>
              <p className="text-sm font-semibold text-[#010221]">My account</p>
              <p className="text-xs text-gray-400">Settings</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}