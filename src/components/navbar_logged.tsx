'use client';

import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const BRAND_COLOR = "bg-[#010221]";
const LINK_CLASS = "hover:underline hover:decoration-2 hover:underline-offset-4 hover:decoration-[#010221] cursor-pointer";
const BTN_CLASS = `${BRAND_COLOR} text-white hover:bg-[#010221]/90 hover:text-white rounded-lg`;

function SearchBar() {
  return (
    <InputGroup className="h-10 w-full max-w-[480px] !border-gray-200 has-[[data-slot=input-group-control]:focus-visible]:!border-gray-400 has-[[data-slot=input-group-control]:focus-visible]:!ring-gray-200/60">
      <InputGroupInput className="placeholder:text-gray-400" placeholder="Search..." />
      <InputGroupAddon>
        <Search className="text-gray-400" />
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

export default function NavbarLogged() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 w-full">
      <div className="flex items-center justify-between px-4 h-14 gap-4">
        

        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" /> 
        </div>

      
        <div className="hidden sm:flex flex-1 justify-center max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <div className="hidden md:flex items-center gap-6">
            <SolutionsLink />
            <Button className={`h-9 px-4 ${BTN_CLASS} cursor-pointer`} variant="outline">
              Check Goals
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}