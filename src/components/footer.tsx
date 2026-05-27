import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:divide-x md:divide-gray-200">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            {/* Logo + name */}
            <div className="flex items-center gap-2">
              <Image
                src="/logos/imagotipo-finans2.png"
                alt="Kuali logo"
                width={72}
                height={72}
              />
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 leading-relaxed max-w-42">
              Finans helps small businesses track, understand and grow their finances with the power of AI.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#010221] transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#010221] transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#010221] transition-colors"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Product column */}
          <div className="flex flex-col gap-3 md:pl-10">
            <p className="text-sm font-semibold text-[#010221]">Product</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/ai-assistant" className="text-sm text-gray-500 hover:text-[#010221] transition-colors">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/ocr-scanner" className="text-sm text-gray-500 hover:text-[#010221] transition-colors">
                  OCR Scanner
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-500 hover:text-[#010221] transition-colors">
                  Reports creation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div className="flex flex-col gap-3 md:pl-10">
            <p className="text-sm font-semibold text-[#010221]">Resources</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/help" className="text-sm text-gray-500 hover:text-[#010221] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-[#010221] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-[#010221] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-500 hover:text-[#010221] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div className="flex flex-col gap-3 md:pl-10">
            <p className="text-sm font-semibold text-[#010221]">Company</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-[#010221] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-[#010221] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar with tagline */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
          <p className="text-xs text-gray-400 italic">
            Made with ♥ for small businesses
          </p>
        </div>
      </div>
    </footer>
  );
}