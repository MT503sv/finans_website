import Image from "next/image";

export default function FirstBlock() {
  return (
    <div className="font-sans bg[F5F7FA] px-6 sm:px-10 md:px-16 lg:px-24 py-10 sm:py-14">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* LEFT SIDE */}
        <div className="max-w-xl w-full">

          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <h1>Understand your</h1>
            <div className="flex flex-wrap gap-2">
              <h1>money.</h1>
              <h1 className="text-blue-950">Grow your</h1>
            </div>
            <h1 className="text-blue-950">bussiness.</h1>
          </div>

          <p className="text-sm sm:text-base md:text-lg max-w-md text-gray-600 leading-relaxed">
            Finans helps you track income and expenses,
            see what matters, and make better financial
            decisions with confidence.
          </p>

          <div className="mt-6">
            <button className="bg-blue-950 text-white px-6 py-2.5 rounded-md hover:bg-blue-800 transition-colors w-full sm:w-auto text-sm font-medium">
              Start for free
            </button>
          </div>

          {/* Icons row */}
          <div className="flex flex-col sm:flex-row gap-10 mt-10">

            {/* Icon 1 */}
            <div className="flex items-start gap-3 min-w-[130px]">
              <div className="flex-shrink-0 bg-red-100 p-2 rounded-xl">
                <Image src="/homepage/Mini-icon-3.png" alt="Easy to use icon" width={32} height={32} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Easy to use</h3>
                <p className="text-xs text-gray-500 mt-0.5">No financial<br />knowledge needed.</p>
              </div>
            </div>

            {/* Icon 2 */}
            <div className="flex items-start gap-3 min-w-[130px]">
              <div className="flex-shrink-0 bg-purple-100 p-2 rounded-xl">
                <Image src="/homepage/Mini-icon-1.png" alt="All in one place icon" width={32} height={32} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">All in one place</h3>
                <p className="text-xs text-gray-500 mt-0.5">Income, expenses,<br />savings and more.</p>
              </div>
            </div>

            {/* Icon 3 */}
            <div className="flex items-start gap-3 min-w-[130px]">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-xl">
                <Image src="/homepage/Mini-icon-2.png" alt="Smart insights icon" width={32} height={32} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Smart insights</h3>
                <p className="text-xs text-gray-500 mt-0.5">Helping you make<br />better decisions.</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - Illustration */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end flex-shrink-0">
          <Image
            src="/homepage/FirstImage.png"
            alt="Financial dashboard illustration"
            width={480}
            height={400}
            className="object-contain w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px]"
            priority
          />
        </div>

      </div>
    </div>
  );
}