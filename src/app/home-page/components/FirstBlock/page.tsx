import Image from "next/image";

export default function FirstBlock() {
  return (
    <div className="flex flex-1 font-sans bg-[#FFFFFF] px-4 sm:px-10 md:px-20 lg:px-24 pt-10 sm:pt-20 pb-8 sm:pb-24">
      <div className="flex flex-col items-center text-center w-full">

        {/* HEADING */}
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 max-w-4xl">
          <h1>Understand your money.</h1>
          <h1 className="text-blue-950">Grow your business.</h1>
        </div>

        {/* SUBTEXT */}
        <p className="text-sm sm:text-base md:text-lg max-w-xl text-gray-600 leading-relaxed">
          Finans helps you track income and expenses,
          see what matters, and make better financial
          decisions with confidence.
        </p>

        {/* CTA BUTTON */}
        <div className="mt-6 sm:mt-8">
          <button className="bg-[#010221] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-[#010221] transition-colors text-sm sm:text-base font-medium cursor-pointer">
            Start for free
          </button>
        </div>

        {/* ICONS ROW */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 mt-10 sm:mt-14 w-full max-w-2xl">
          {/* Icon 1 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-red-100 p-2 rounded-xl">
              <Image src="/homepage/Mini-icon-3.png" alt="Easy to use icon" width={32} height={32} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">Easy to use</h3>
              <p className="text-xs text-gray-500 mt-0.5">No financial knowledge needed.</p>
            </div>
          </div>

          {/* Icon 2 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-purple-100 p-2 rounded-xl">
              <Image src="/homepage/Mini-icon-1.png" alt="All in one place icon" width={32} height={32} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">All in one place</h3>
              <p className="text-xs text-gray-500 mt-0.5">Income, expenses, savings and more.</p>
            </div>
          </div>

          {/* Icon 3 */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-xl">
              <Image src="/homepage/Mini-icon-2.png" alt="Smart insights icon" width={32} height={32} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-sm">Smart insights</h3>
              <p className="text-xs text-gray-500 mt-0.5">Helping you make better decisions.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}