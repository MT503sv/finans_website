'use client';

import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function NavbarLogin() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "FAQs", href: "/FAQ" },
  ];

  const linkClass =
    "hover:underline hover:decoration-2 hover:underline-offset-4 hover:decoration-[#010221]";

  return (
    <nav className="bg-white sticky top-0 z-40">
      <div className="flex items-center justify-between px-6">
        <div className="shrink-0 flex items-center gap-3 mx-2 mb-1">
          <Link href="/" className="relative h-20 w-30 block">
            <Image
              src="/logos/finans-imagotipo-2.png"
              alt="Finans Logo"
              fill
              priority
              className="object-contain"
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-10 cursor-pointer -ml-150">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3 mx-0">
          <Link href="/sign-in">
            <Button className="hidden lg:flex h-10 w-25 bg-[#010221] text-white hover:bg-[#010221]/90 rounded-lg cursor-pointer" variant="default">
              Login
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="hidden lg:flex h-10 w-25 bg-[#010221] text-white hover:bg-[#010221]/90 rounded-lg cursor-pointer" variant="default">
              Signup
            </Button>
          </Link>

          <Link href="/sign-up" className="lg:hidden">
            <Button className="h-10 px-4 bg-[#010221] text-white hover:bg-[#010221]/90 rounded-lg text-sm font-medium" variant="default">
              Create Account
            </Button>
          </Link>

          <button
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-[#010221] transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#010221] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-[#010221] transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden flex flex-col items-start px-10 pb-4 space-y-4 border-t">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`cursor-pointer ${linkClass}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/sign-in" className="text-sm font-medium pt-2">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}