import Image from "next/image";
import { TrendingUp, Clock, User, Check, Send, BarChart2, ChevronRight, Sparkles } from "lucide-react";

export default function ThirdBlock() {
  return (
    <div className="px-4 py-4 font-sans">
      <section className="bg-[#EEEFFE] rounded-3xl max-w-6xl mx-auto px-6 sm:px-10 py-8 sm:py-10">

        {/* Powered by AI badge */}
        <div className="inline-flex items-center gap-1.5 border border-[#010221] rounded-full px-4 py-1 text-[11px] font-semibold text-[#010221] mb-8 tracking-widest uppercase">
          <Sparkles size={12} className="text-[#010221]" />
          Powered by AI
        </div>

        {/* Main grid */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 items-start relative">

          {/* LEFT: Text content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Meet{" "}
              <span className="text-[#010221]">Kuali</span>
              {", "}your AI
              <br />
              financial assistant
            </h1>

            <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
              Kuali uses advanced AI to understand your data, answer your
              questions, and give you personalized insights to help your
              business grow.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-5">
              {/* Smart insights */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#E8E8F0] flex items-center justify-center shrink-0">
                  <TrendingUp size={20} className="text-[#010221]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#010221] flex items-center justify-center shrink-0">
                    <Check size={11} color="white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Smart insights</p>
                    <p className="text-xs text-gray-400">Get clear answers instantly.</p>
                  </div>
                </div>
              </div>

              {/* Save time */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#E8E8F0] flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-[#010221]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#010221] flex items-center justify-center shrink-0">
                    <Check size={11} color="white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Save time</p>
                    <p className="text-xs text-gray-400">Let Kuali handle the complexity for you.</p>
                  </div>
                </div>
              </div>

              {/* Personalized advice */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#E8E8F0] flex items-center justify-center shrink-0">
                  <User size={20} className="text-[#010221]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#010221] flex items-center justify-center shrink-0">
                    <Check size={11} color="white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Personalized advice</p>
                    <p className="text-xs text-gray-400">Recommendations based on your data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kuali logo — solo en desktop */}
          <div className="hidden lg:flex absolute left-[490px] top-[20px] -translate-x-1/2 -translate-y-1/2 z-10">
            <Image
              src="/homepage/Kuali-logo.png"
              alt="Kuali AI assistant illustration"
              width={160}
              height={160}
              className="object-contain"
            />
          </div>

          {/* RIGHT: Cards */}
          <div className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 w-full">

              {/* AI Insight card */}
              <div className="flex items-start gap-3 sm:gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#EEEFFE] flex items-center justify-center shrink-0">
                  <BarChart2 size={20} className="text-[#010221]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base mb-1">AI insight</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    Coffee sales are your top income source this week. Consider
                    increasing stock for higher profit.
                  </p>
                  <button className="flex items-center cursor-pointer gap-1 text-sm text-[#010221] font-semibold hover:underline">
                    View details
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Ask Kuali section */}
              <div>
                <p className="text-sm text-gray-400 mb-3">Ask Kuali anything...</p>
                <div className="flex flex-col gap-2 mb-4">
                  <button className="text-left text-sm text-gray-700 bg-[#F5F6FD] rounded-xl px-4 py-3 hover:bg-[#E0E0EC] transition-colors duration-200">
                    What were my top expenses?
                  </button>
                  <button className="text-left text-sm text-gray-700 bg-[#F5F6FD] rounded-xl px-4 py-3 hover:bg-[#E0E0EC] transition-colors duration-200">
                    How can I save more this month?
                  </button>
                </div>

                {/* Input row */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Ask Kuali anything..."
                    className="flex-1 text-sm text-gray-600 bg-[#F5F6FD] rounded-xl px-4 py-3 outline-none placeholder-gray-400 border border-transparent focus:border-[#010221] transition-colors duration-200"
                  />
                  <button className="bg-[#010221] text-white rounded-xl w-11 h-11 flex items-center justify-center hover:bg-[#010221] transition-colors duration-200 shadow shrink-0">
                    <Send size={16} />
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
