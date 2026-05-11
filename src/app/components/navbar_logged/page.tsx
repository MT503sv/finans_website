'use client';

import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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

export default function NavbarLogged() {
  return (
    <nav className="flex items-center justify-between px-6 py-2  border-b">
      <div>
        <Image src="/logos/isotipo-finans.png" alt="Logo" width={32} height={32} />
      </div>
      <div className="flex-1 mx-34">
        <SearchBar />
      </div>
      <div className="flex items-center mx-35 space-x-4">

        <Button className="h-8 w-17" variant="outline"></Button>

        {/* Here goes the Clerk Profile components */}
      </div>
    </nav>
  );
}