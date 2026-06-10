'use client';

import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  LayoutDashboard,
  FileBarChart2,
  Package,
  Target,
  Bot,
  ScanLine,
  Star,
  LucideIcon,
} from "lucide-react";

const OrganizationSwitcher = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.OrganizationSwitcher),
  { ssr: false }
);

const BRAND_COLOR = "bg-[#010221]";
const BTN_CLASS = `${BRAND_COLOR} text-white hover:bg-[#010221]/90 hover:text-white rounded-lg`;

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  section: string;
}

const navItems: NavItem[] = [
  { section: "My business", title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { section: "My business", title: "My Goals", url: "/goals", icon: Target },
  { section: "Tracking", title: "Sales", url: "/sales", icon: FileBarChart2 },
  { section: "Tracking", title: "Incomes", url: "/incomes", icon: FileBarChart2 },
  { section: "Tracking", title: "Expenses", url: "/expenses", icon: FileBarChart2 },
  { section: "Tracking", title: "Debts", url: "/debts", icon: FileBarChart2 },
  { section: "Tools", title: "AI chat", url: "/kuali", icon: Bot },
  { section: "Tools", title: "Scanner", url: "/ocr", icon: ScanLine },
  { section: "Tools", title: "Reports", url: "/report", icon: FileBarChart2 },
  { section: "Premium", title: "Get Premium", url: "/plans", icon: Star },
];

export default function NavbarLogged() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? navItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.section.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(url: string) {
    router.push(url);
    setQuery("");
    setOpen(false);
  }

  return (
    <nav className="bg-white border-b border-gray-100 w-full">
      <div className="flex items-center justify-between px-4 h-14 gap-4">

        {/* Searchbar */}
        <div className="flex-1 flex justify-center max-w-2xl relative" ref={ref}>
          <div className="relative w-full max-w-[480px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Search..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200/60 bg-white"
            />

            {/* Dropdown */}
            {open && filtered.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.url}
                      onClick={() => handleSelect(item.url)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-[#010221]">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.section}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No results */}
            {open && query.trim() && filtered.length === 0 && (
              <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-3">
                <p className="text-sm text-gray-400">No results for &quot;{query}&quot;</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <div className="hidden md:flex items-center gap-6">
            <OrganizationSwitcher
              appearance={{
                elements: {
                  organizationSwitcherTrigger: "border border-gray-200 hover:bg-gray-100",
                }
              }}
            />
            <Link href="/kuali">
              <Button className={`h-9 px-4 ${BTN_CLASS} cursor-pointer`} variant="outline">
                Go to AI Chat
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
}