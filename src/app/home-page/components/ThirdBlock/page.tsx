import Image from "next/image";

export default function ThirdBlock() {
  return (
    <div className="px-4 py-4 font-sans">
      <section className="bg-[#E8EAF6] rounded-2xl max-w-4xl mx-auto">
        <div className="px-6 py-5">

          {/* Power by AI badge */}
          <div className="inline-flex items-center gap-2 border border-[#9fa8c7] rounded-full px-3 py-0.5 text-[10px] font-bold text-[#5c6693] mb-4 tracking-widest uppercase">
            Power by AI
          </div>

          {/* Main grid: left content + right cards */}
          <div className="flex flex-col lg:flex-row gap-8 items-center">

            {/* LEFT: Text content */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                Meet{" "}
                <span className="text-[#3B4FE4]">Kuali</span>
                {", "}your AI
                <br />
                financial assistant
              </h1>

              <p className="text-[11px] text-gray-500 max-w-[240px] mb-4 leading-relaxed">
                Kuali uses advanced AI to understand your data, answer your
                questions, and give you personalized insights to help your
                business grow.
              </p>

              {/* Feature pills */}
              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                {/* Smart insights */}
                <div className="flex items-start gap-1.5">
                  <div className="mt-0.5 text-[#3B4FE4]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-[11px]">Smart insights</p>
                    <p className="text-[10px] text-gray-400">Get clear answers instantly.</p>
                  </div>
                </div>

                {/* Personalized advice */}
                <div className="flex items-start gap-1.5">
                  <div className="mt-0.5 text-[#3B4FE4]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-[11px]">Personalized advice</p>
                    <p className="text-[10px] text-gray-400">Recommendations based on your data.</p>
                  </div>
                </div>

                {/* Save time */}
                <div className="flex items-start gap-1.5">
                  <div className="mt-0.5 text-[#3B4FE4]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-[11px]">Save time</p>
                    <p className="text-[10px] text-gray-400">Let Kuali handle the complexity for you.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Mascot + cards */}
            <div className="flex-1 min-w-0 relative flex flex-col items-center gap-3 w-full">

              {/* Top row: mascot bubble + insight card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 w-full justify-center">

                {/* Kuali mascot bubble */}
                <div className="relative flex flex-col items-center">
                  {/* Speech bubble */}
                  <div className="bg-white rounded-xl shadow-md px-4 py-1.5 text-[11px] font-semibold text-gray-800 mb-1.5 whitespace-nowrap">
                    Hi! I&apos;m Kuali
                  </div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                    <Image src="/homepage/Kuali-logo.png" alt="Kuali logo" fill className="object-contain" />
                  </div>
                </div>

                {/* AI insight card */}
                <div className="bg-white rounded-xl shadow-md p-3 w-full sm:max-w-[190px]">
                  <p className="text-[11px] font-bold text-gray-800 mb-1">Ai insight</p>
                  <p className="text-[10px] text-gray-500 leading-snug mb-2.5">
                    Coffee sales are your top income source this week. Consider
                    increasing stock for higher profit.
                  </p>
                  <button className="text-[10px] text-[#3B4FE4] font-semibold border border-[#3B4FE4] rounded-lg px-2.5 py-0.5 hover:bg-[#3B4FE4] hover:text-white transition-colors duration-200">
                    View details
                  </button>
                </div>
              </div>

              {/* Ask Kuali chat card */}
              <div className="bg-white rounded-xl shadow-md p-3 w-full sm:max-w-[340px]">
                <p className="text-[10px] text-gray-400 mb-2">Ask Kuali anything...</p>
                <div className="flex flex-col gap-1.5">
                  <button className="text-left text-[11px] text-gray-700 bg-[#F3F4FA] rounded-lg px-3 py-1.5 hover:bg-[#E0E3F7] transition-colors duration-200">
                    What were my top expenses?
                  </button>
                  <button className="text-left text-[11px] text-gray-700 bg-[#F3F4FA] rounded-lg px-3 py-1.5 hover:bg-[#E0E3F7] transition-colors duration-200">
                    How can I save more this month?
                  </button>
                </div>
                {/* Send button row */}
                <div className="flex justify-end mt-2">
                  <button className="bg-[#3B4FE4] text-white rounded-lg w-7 h-7 flex items-center justify-center hover:bg-[#2a3db8] transition-colors duration-200 shadow">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    </div>
  );
}