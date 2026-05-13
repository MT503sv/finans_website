'use client';

import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useState } from "react";

export default function NavbarLogged() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = ["Services", "Pricing", "About Us", "Contact Us"];
  const linkClass =
    "hover:underline hover:decoration-2 hover:underline-offset-4 hover:decoration-[#010221]";

  return (
    <nav>
      <div className="flex items-center justify-between px-6 py-2">
        <div className="px-4 lg:px-10">
          <Image src="/logos/isotipo-finans.png" alt="Logo" width={42} height={42} />
        </div>
        <div className="hidden lg:flex items-center space-x-10 cursor-pointer -ml-125">
          {navLinks.map((link) => (
            <h1 key={link} className={linkClass}>{link}</h1>
          ))}
        </div>
        <div className="flex items-center space-x-3 mx-4 lg:mx-10">
          <Button className="hidden lg:flex h-10 w-20 bg-[#010221] text-white hover:bg-[#010221]/90 rounded-lg" variant="default">
            Login
          </Button>
          <Button className="hidden lg:flex h-10 w-25 bg-[#010221] text-white hover:bg-[#010221]/90 rounded-lg" variant="default">
            Signup
          </Button>
          <Button className="lg:hidden h-10 px-4 bg-[#010221] text-white hover:bg-[#010221]/90 rounded-lg text-sm font-medium" variant="default">
            Create Account
          </Button>
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
            <h1 key={link} className={`cursor-pointer ${linkClass}`}>{link}</h1>
          ))}
        </div>
      )}
    </nav>
  );
}