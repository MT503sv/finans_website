import Image from "next/image";
 
export default function ThirdBlock() {
  return (
    <section className="bg-gray-200 px-4 py-6 font-sans rounded-3xl">
      <div className="rounded-3xl px-6 py-12 max-w-6xl mx-auto">
 
        {/* Power by AI badge */}
        <div className="inline-flex items-center gap-2 border border-gray-400 rounded-full px-4 py-1 text-xs font-semibold text-gray-600 mb-8 tracking-widest uppercase">
          Power by AI
        </div>
 
        {/* Main grid: left content + right cards */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center">
 
          {/* LEFT: Text content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Meet{" "}
              <span className="text-[#3B4FE4]">Kuali</span>
              {", "}your AI
              <br />
              financial assistant
            </h1>
 
            <p className="text-sm sm:text-base text-gray-500 max-w-sm mb-8 leading-relaxed">
              Kuali uses advanced AI to understand your data, answer your
              questions, and give you personalized insights to help your
              business grow.
            </p>
 
            {/* Feature pills */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Smart insights */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-[#3B4FE4]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Smart insights</p>
                  <p className="text-xs text-gray-500">Get clear answers instantly.</p>
                </div>
              </div>
 
              {/* Personalized advice */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-[#3B4FE4]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Personalized advice</p>
                  <p className="text-xs text-gray-500">Recommendations based on your data.</p>
                </div>
              </div>
 
              {/* Save time */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-[#3B4FE4]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Save time</p>
                  <p className="text-xs text-gray-500">Let Kuali handle the complexity for you.</p>
                </div>
              </div>
            </div>
          </div>
 
          {/* RIGHT: Mascot + cards */}
          <div className="flex-1 min-w-0 relative flex flex-col items-center gap-4 w-full">
 
            {/* Top row: mascot bubble + insight card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full justify-center">
 
              {/* Kuali mascot bubble */}
              <div className="relative flex flex-col items-center">
                {/* Speech bubble */}
                <div className="bg-white rounded-2xl shadow-md px-5 py-2 text-sm font-semibold text-gray-800 mb-2 whitespace-nowrap">
                  Hi! I&apos;m Kuali
                </div>
                <div className="w-28 h-28 sm:w-36 sm:h-36 relative">
                  <Image src="/homepage/Kuali-logo.png" alt="Kuali logo" fill className="object-contain" />
                </div>
              </div>
 
              {/* AI insight card */}
              <div className="bg-white rounded-2xl shadow-md p-4 w-full sm:max-w-[220px]">
                <p className="text-xs font-bold text-gray-800 mb-1">Ai insight</p>
                <p className="text-xs text-gray-500 leading-snug mb-3">
                  Coffee sales are your top income source this week. Consider
                  increasing stock for higher profit.
                </p>
                <button className="text-xs text-[#3B4FE4] font-semibold border border-[#3B4FE4] rounded-lg px-3 py-1 hover:bg-[#3B4FE4] hover:text-white transition-colors duration-200">
                  View details
                </button>
              </div>
            </div>
 
            {/* Ask Kuali chat card */}
            <div className="bg-white rounded-2xl shadow-md p-4 w-full sm:max-w-[400px]">
              <p className="text-xs text-gray-400 mb-3">Ask Kuali anything...</p>
              <div className="flex flex-col gap-2">
                <button className="text-left text-sm text-gray-700 bg-[#F3F4FA] rounded-xl px-4 py-2 hover:bg-[#E0E3F7] transition-colors duration-200">
                  What were my top expenses?
                </button>
                <button className="text-left text-sm text-gray-700 bg-[#F3F4FA] rounded-xl px-4 py-2 hover:bg-[#E0E3F7] transition-colors duration-200">
                  How can I save more this month?
                </button>
              </div>
              {/* Send button row */}
              <div className="flex justify-end mt-3">
                <button className="bg-[#3B4FE4] text-white rounded-xl w-9 h-9 flex items-center justify-center hover:bg-[#2a3db8] transition-colors duration-200 shadow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
 
          </div>
        </div>
      </div>
    </section>
  );
}