import Image from "next/image";

export default function CTABlock() {
  return (
    <section className="bg-white font-sans py-10 sm:py-16 px-6 sm:px-10 md:px-16 lg:px-24 mb-10 sm:mb-20">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-center sm:text-left">

        {/* Icon */}
        <div className="shrink-0">
          <Image
            src="/homepage/Send-logo.png"
            alt="Paper plane"
            width={90}
            height={90}
            style={{ height: "auto" }}
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f1535] leading-tight mb-3">
            Ready to take control{" "}
            <br />
            <span className="text-blue-950">of your finances?</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Join thousands of small business owners<br className="hidden sm:block" />
            managing smarter every day.
          </p>
        </div>

      </div>
    </section>
  );
}