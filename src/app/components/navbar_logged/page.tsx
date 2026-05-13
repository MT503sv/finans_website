'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const LOGO_SRC = "/logos/isotipo-finans.png";
const BRAND_COLOR = "bg-[#010221]";
const LINK_CLASS = "hover:underline hover:decoration-2 hover:underline-offset-4 hover:decoration-[#010221] cursor-pointer";
const BTN_CLASS = `${BRAND_COLOR} text-white hover:bg-[#010221]/90 hover:text-white rounded-lg`;

function SearchBar() {
  return (
    <InputGroup className="h-10 w-120 position-relative">
      <InputGroupInput className="text" placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}

function SolutionsLink() {
  return (
    <div className="flex items-center gap-1 cursor-pointer group">
      <h1 className={LINK_CLASS}>Solutions</h1>
      <ChevronDown className="w-4 h-4 text-[#010221] group-hover:opacity-70" />
    </div>
  );
}

function HamburgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      className="sm:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span className={`block h-0.5 w-6 bg-[#010221] transition-transform duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
      <span className={`block h-0.5 w-6 bg-[#010221] transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
      <span className={`block h-0.5 w-6 bg-[#010221] transition-transform duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
    </button>
  );
}

export default function NavbarLogged() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div className="flex items-center justify-between px-6 py-2 gap-4">

        <div className="shrink-0 flex items-center gap-3 -mx-2">
          <Image src={LOGO_SRC} alt="Logo" width={32} height={32} />
        </div>

        <div className="hidden sm:flex flex-1 mx-16">
          <SearchBar />
        </div>

        <div className="hidden md:flex items-center gap-7 shrink-0 mx-17">
          <SolutionsLink />
          <div className="flex items-center gap-1">
            <Button className={`h-10 w-35 ${BTN_CLASS}`} variant="outline">
              Check Goals
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">

          <HamburgerButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden flex flex-col px-2 pb-4 space-y-4">
          <div className="pt-3">
            <SearchBar />
          </div>
          <SolutionsLink />
          <Button className={`h-10 w-full ${BTN_CLASS}`} variant="outline">
            Pricing
          </Button>
          <Button className={`h-10 w-full ${BTN_CLASS}`} variant="outline">
            Check Goals
          </Button>
        </div>
      )}
    </nav>
  );
}