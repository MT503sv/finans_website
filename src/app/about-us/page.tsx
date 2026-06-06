import Image from "next/image";
import Footer from "@/components/footer";

export default function AboutSection() {
  return (
    <>
      <section className="bg-[#ffffff] py-10 px-4 lg:px-20 pb-30 min-h-screen">

        {/* NEW TOP SECTION */}
        <div className="relative overflow-hidden py-5 px-6 mb-12">

          {/* TITLE */}
          <div className="text-center mb-24">
            <h2 className="text-6xl font-extrabold text-[#010221] leading-tight">
              About Us
            </h2>
          </div>

          {/* TIMELINE */}
          <div className="relative z-10 grid md:grid-cols-3 gap-14 mt-24">

            {/* LINE */}
            <div className="hidden md:block absolute top-10 left-[17%] w-[66%] border-t-2 border-dashed border-[#010221]/20"></div>

            {/* STEP 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-lg border-2 flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
                <Image src="/logos/idea.png" alt="Idea" width={38} height={38} className="object-contain" />
              </div>
              <div className="hidden md:block w-3 h-3 rounded-full bg-[#010221] absolute top-9 right-[-25px]"></div>
              <h3 className="text-2xl font-semibold text-[#010221] mt-8">The beginning</h3>
              <p className="text-gray-600 leading-relaxed mt-4 max-w-sm mx-auto">
                We noticed how difficult financial management was for entrepreneurs and small businesses trying to stay organized.
              </p>
            </div>

            {/* STEP 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-lg border-2 border-[#010221]/5 flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
                <Image src="/logos/rocket.svg" alt="Solution" width={38} height={38} className="object-contain" />
              </div>
              <div className="hidden md:block w-3 h-3 rounded-full bg-[#010221] absolute top-9 right-[-25px]"></div>
              <h3 className="text-2xl font-semibold text-[#010221] mt-8">Our solution</h3>
              <p className="text-gray-600 leading-relaxed mt-4 max-w-sm mx-auto">
                Finans was created to simplify expense tracking, budgeting, and smart financial organization in one place.
              </p>
            </div>

            {/* STEP 3 */}
            <div className="text-center relative">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-lg border-2 border[#010221]/5 flex items-center justify-center hover:-translate-y-2 transition-all duration-300">
                <Image src="/logos/growth2.svg" alt="Impact" width={38} height={38} className="object-contain" />
              </div>
              <h3 className="text-2xl font-semibold text-[#010221] mt-8">The impact</h3>
              <p className="text-gray-600 leading-relaxed mt-4 max-w-sm mx-auto">
                Today, Finans helps people and businesses make smarter financial decisions with confidence and clarity.
              </p>
            </div>

          </div>

          {/* QUOTE */}
          <div className="relative z-10 mt-24 bg-[#dfe4ff] backdrop-blur-md border border-white rounded-[32px] p-10 max-w-5xl mx-auto shadow-sm">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="flex gap-5">
                <div className="text-6xl text-[#010221]/20 font-bold leading-none"></div>
                <p className="text-[#010221] text-lg leading-relaxed font-medium">
                  We believe financial management should feel simple, modern, and accessible for everyone. That is the future we are building with Finans.
                </p>
              </div>
              <div className="md:border-l border-[#010221]/10 md:pl-10 text-[#010221] font-semibold text-lg">
                — The Finans Team
              </div>
            </div>
          </div>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* CARD 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#dfe4ff] flex items-center justify-center mb-6">
              <Image src="/logos/team2.svg" alt="Team" width={32} height={32} className="object-contain" />
            </div>
            <h3 className="text-2xl font-semibold text-[#010221] mb-4">Who are we?</h3>
            <p className="text-gray-600 leading-relaxed">
              We are a digital finance platform created to help entrepreneurs and small businesses manage their money in a smarter way.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#dfe4ff] flex items-center justify-center mb-6">
              <Image src="/logos/mission2.svg" alt="Mission" width={32} height={32} className="object-contain" />
            </div>
            <h3 className="text-2xl font-semibold text-[#010221] mb-4">Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide intelligent and easy-to-use financial tools that help businesses grow and improve their productivity.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#dfe4ff] flex items-center justify-center mb-6">
              <Image src="/logos/vision2.svg" alt="Vision" width={32} height={32} className="object-contain" />
            </div>
            <h3 className="text-2xl font-semibold text-[#010221] mb-4">Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become the leading financial platform for entrepreneurs by offering modern and accessible digital solutions.
            </p>
          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}