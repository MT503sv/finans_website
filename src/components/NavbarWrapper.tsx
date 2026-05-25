'use client'; 

import { usePathname } from "next/navigation";
import NavbarLogin from "@/components/navbar_login"; 

export default function NavbarWrapper({ userId }: { userId: string | null }) {
  const pathname = usePathname();
  const noNavbarRoutes = ["/sign-in", "/sign-up"];

  if (noNavbarRoutes.some(route => pathname.startsWith(route))) {
    return null;
  }


  return <NavbarLogin />;
}