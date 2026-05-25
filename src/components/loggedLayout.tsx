'use client'

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import NavbarLogged from "@/components/navbar_logged"

export default function LoggedLayout({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState(true)
  const [open, setOpen] = useState(true)

  const handleMouseEnter = () => { if (!pinned) setOpen(true) }
  const handleMouseLeave = () => { if (!pinned) setOpen(false) }
  const handlePin = () => {
    setPinned(prev => {
      const next = !prev
      if (!next) setOpen(false)
      return next
    })
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPin={handlePin}
        pinned={pinned}
      />
      <SidebarInset>
        <NavbarLogged
          sidebarOpen={open}
          onLogoHover={() => { if (!pinned) setOpen(true) }}
        />
        <main className="flex-1 p-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}