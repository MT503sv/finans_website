"use client"
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Centered layout — all stacked */}
        <div className="flex flex-col items-center text-center gap-8">

          {/* Logo */}
          <Image
            src="/logos/finans-image-2.png"
            alt="Finans logo"
            width={52}
            height={52}
          />

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            Finans helps small businesses track, understand and grow their finances with the power of AI.
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-gray-200" />

          {/* Three links — horizontal on sm+, stacked on mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto sm:justify-center">

            {/* About Us */}
            <Link
              href="/about"
              className="flex items-center gap-3 group px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010221] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#010221] group-hover:text-white transition-colors">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-400 leading-none mb-0.5 uppercase tracking-wide">Company</p>
                <p className="text-sm font-semibold text-[#010221]">About Us</p>
              </div>
            </Link>

            <div className="hidden sm:block w-px h-10 bg-gray-200" />

            {/* FAQs */}
            <Link
              href="/faq"
              className="flex items-center gap-3 group px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010221] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#010221] group-hover:text-white transition-colors">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-400 leading-none mb-0.5 uppercase tracking-wide">Support</p>
                <p className="text-sm font-semibold text-[#010221]">FAQs</p>
              </div>
            </Link>

            <div className="hidden sm:block w-px h-10 bg-gray-200" />

            {/* Contact — copy to clipboard */}
            <button
              onClick={() => navigator.clipboard.writeText("finans.expotech@gmail.com")}
              className="flex items-center gap-3 group px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center sm:justify-start cursor-pointer"
              title="Click to copy email"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010221] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#010221] group-hover:text-white transition-colors">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-400 leading-none mb-0.5 uppercase tracking-wide">Click to copy</p>
                <p className="text-sm font-semibold text-[#010221]">finans.expotech@gmail.com</p>
              </div>
            </button>

          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-gray-200" />

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#010221] hover:bg-[#010221] hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#010221] hover:bg-[#010221] hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#010221] hover:bg-[#010221] hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">© 2026 Finans. All rights reserved.</p>
          <p className="text-xs text-gray-400 italic">Made with ♥ for small businesses</p>
        </div>
      </div>
    </footer>
  );
}