const plans = [
  {
    badge: "Starter",
    label: "FREE",
    tagline: "Perfect for getting started",
    price: "0",
    period: "/Month",
    features: [
      "Income & expense tracking",
      "Inventory control",
      "Basic charts",
      "Basic AI (limited use)",
      "1 account",
    ],
    cta: "Choose Plan",
    dark: false,
    highlight: false,
  },
  {
    badge: "Smart Choice",
    label: "Platinum",
    tagline: "For businesses ready to grow",
    price: "4.99",
    period: "/Month",
    features: [
      "Everything in Free",
      "Note scanning (OCR)",
      "Predictive AI",
      "Financial goals",
      "Budgets",
      "Monthly reports",
      "Export to Excel",
    ],
    cta: "Choose Plan",
    dark: true,
    highlight: true,
  },
  {
    badge: "Most Popular",
    label: "Gold",
    tagline: "For teams and expanding businesses",
    price: "9.99",
    period: "/Month",
    features: [
      "Everything in Platinum",
      "3 Users",
      "Advanced AI based on your business history",
      "3 business profiles",
      "Daily & weekly reports",
    ],
    cta: "Choose Plan",
    dark: false,
    highlight: false,
  },
];

export default function PricingBlock() {
  return (
    <section className="font-sans py-12 sm:py-16 px-4">
      <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#000000]">
          Plans for every
          <br />
          stage of your
          <span className="text-[#010221] mx-3">business</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 leading-relaxed">
          accessible plans for micro and small enterprises
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.label}
            className={`
              relative rounded-3xl flex flex-col gap-4 shadow-lg w-full
              ${plan.dark ? "bg-[#010221]" : "bg-white border border-gray-200"}
              p-6
            `}
          >
            {/* Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full
                  ${plan.dark ? "bg-white/10 text-white" : "bg-gray-100 text-[#010221]"}
                `}
              >
                {plan.badge}
              </span>
              <span className={`text-xs ${plan.dark ? "text-white/30" : "text-gray-300"}`}>⊞</span>
            </div>

            {/* Plan name */}
            <h3 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${plan.dark ? "text-white" : "text-[#010221]"}`}>
              {plan.label}
            </h3>

            {/* Tagline */}
            <p className={`text-xs leading-snug ${plan.dark ? "text-white/60" : "text-gray-400"}`}>
              {plan.tagline}
            </p>

            {/* Price */}
            <div>
              <span className={`text-4xl font-extrabold ${plan.dark ? "text-white" : "text-[#010221]"}`}>
                $ {plan.price}
              </span>
              <span className={`text-xs ml-1 ${plan.dark ? "text-white/50" : "text-gray-400"}`}>
                {plan.period}
              </span>
            </div>

            {/* Divider */}
            <hr className={plan.dark ? "border-white/10" : "border-gray-200"} />

            {/* Features */}
            <ul className="flex flex-col gap-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs">
                  <span className={`mt-0.5 ${plan.dark ? "text-white/70" : "text-[#010221]"}`}>✓</span>
                  <span className={plan.dark ? "text-white/70" : "text-gray-500"}>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              className={`mt-auto w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                ${plan.dark
                  ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  : "bg-[#010221] text-white hover:opacity-90"}
              `}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}