'use client'

import { useState, useRef, useCallback, memo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import NavbarLogged from "@/components/navbar_logged"
import MobileNav from "@/components/mobile-nav"

const MemoSidebar = memo(AppSidebar)
const MemoNavbar = memo(NavbarLogged)

export default function LoggedLayout({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState(true)
  const [open, setOpen] = useState(true)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isClosing = useRef(false)

  const handleMouseEnter = useCallback(() => {
    if (!pinned && !isClosing.current) {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      setOpen(true)
    }
  }, [pinned])

  const handleMouseLeave = useCallback(() => {
    if (!pinned) {
      closeTimer.current = setTimeout(() => setOpen(false), 300)
    }
  }, [pinned])

  const handlePin = useCallback(() => {
    setPinned(prev => {
      const next = !prev
      if (!next) {
        isClosing.current = true
        if (closeTimer.current) clearTimeout(closeTimer.current)
        setOpen(false)
        setTimeout(() => { isClosing.current = false }, 600)
      } else {
        setOpen(true)
      }
      return next
    })
  }, [])

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      {/* Sidebar for desktop only */}
      <div className="hidden lg:block">
        <MemoSidebar
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPin={handlePin}
          pinned={pinned}
        />
      </div>

      <SidebarInset>
        {/* Desktop navbar */}
        <div className="hidden lg:block sticky top-0 z-40">
          <MemoNavbar />
        </div>

        {/* Mobile navbar with hamburger menu */}
        <div className="lg:hidden sticky top-0 z-40">
          <MobileNav />
        </div>

        <main className="flex-1 p-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}