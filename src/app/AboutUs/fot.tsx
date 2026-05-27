import Image from "next/image";
export default function AboutSection() {
  return (
    <section className="bg-[#f5f5f5] py-10 px-6 lg:px-20">
      
      {/* HERO */}
      <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">

        {/* LEFT */}
        <div>
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-[#1b1b5e] shadow-sm">
            About us
          </span>

          <h2 className="text-5xl font-bold text-[#0b0b4f] mt-6 leading-tight">
            Empowering people <br /> through smart finance
          </h2>

          <p className="text-gray-600 mt-6 text-lg max-w-xl leading-relaxed">
            Finans helps entrepreneurs and small businesses manage their
            finances with simple tools, automation and accessible insights.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-[#16165c] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition">
              Learn more
            </button>

            <button className="border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-white transition">
              Contact us
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">
          <div className="absolute w-72 h-72 bg-[#dfe4ff] rounded-full blur-3xl opacity-60"></div>

          <Image
            src="/logos/growth.svg"
            alt="About us"
            width={20}
            height={30}
            className="relative z-10 rounded-3xl object-cover shadow-xl"
          />
        </div>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* CARD 1 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-[#dfe4ff] flex items-center justify-center mb-6">
            <i className="ri-team-fill text-2xl text-[#16165c]"></i>
          </div>

          <h3 className="text-2xl font-semibold text-[#16165c] mb-4">
            Who are we?
          </h3>

          <p className="text-gray-600 leading-relaxed">
            We are a digital finance platform created to help entrepreneurs
            and small businesses manage their money in a smarter way.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-[#dfe4ff] flex items-center justify-center mb-6">
            <i className="ri-focus-3-fill text-2xl text-[#16165c]"></i>
          </div>

          <h3 className="text-2xl font-semibold text-[#16165c] mb-4">
            Mission
          </h3>

          <p className="text-gray-600 leading-relaxed">
            To provide intelligent and easy-to-use financial tools that help
            businesses grow and improve their productivity.
          </p>
        </div>

        {/* CARD 3 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-[#dfe4ff] flex items-center justify-center mb-6">
            <i className="ri-eye-fill text-2xl text-[#16165c]"></i>
          </div>

          <h3 className="text-2xl font-semibold text-[#16165c] mb-4">
            Vision
          </h3>

          <p className="text-gray-600 leading-relaxed">
            To become the leading financial platform for entrepreneurs by
            offering modern and accessible digital solutions.
          </p>
        </div>

      </div>
    </section>
  );
}

