"use client";

import Link from "next/link";

export default function FirstBlock() {
  return (
    <div className="relative flex flex-1 font-sans overflow-hidden min-h-[600px] sm:min-h-[700px]">

      {/* BACKGROUND VIDEO */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src="/homepage/HP2.mp4"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col items-center text-center w-full px-4 sm:px-10 md:px-20 lg:px-24 pt-10 sm:pt-20 pb-8 sm:pb-24 justify-center">

        {/* HEADING */}
        <div className="text-3xl sm:text-5xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 max-w-4xl">
          <h1 className="text-white">Take care of your money.</h1>
          <h1 className="text-white">Grow your business.</h1>
        </div>

        {/* SUBTEXT */}
        <p className="text-sm sm:text-base md:text-lg max-w-xl text-white/70 leading-relaxed">
          Finans helps you track your finances
          and make better financial
          decisions with confidence.
        </p>

        {/* CTA BUTTON */}
        <div className="mt-6 sm:mt-8">
          <Link href="/sign-up">
            <button className="bg-white text-[#010221] px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-white/90 transition-colors text-sm sm:text-base font-medium cursor-pointer">
              Start for free
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}