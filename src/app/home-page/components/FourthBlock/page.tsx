const plans = [
  {
    badge: "Starter",
    highlight: false,
    label: "FREE",
    tagline: "Perfect for getting started",
    price: "00.00",
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
    golden: false,
  },
  {
    badge: "Smart Choice",
    highlight: true,
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
    dark: false,
    golden: false,
  },
  {
    badge: "Most Popular",
    highlight: false,
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
    dark: true,
    golden: true,
  },
];

export default function PricingBlock() {
  return (
    <section className="font-sans py-16 px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
        Plans for every stage of your business
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.badge}
            className={`
              relative rounded-3xl p-6 w-full max-w-[300px] flex flex-col gap-4 shadow-lg
              ${plan.highlight ? "bg-white scale-105 z-10 py-10 border border-gray-400" : ""}
              ${plan.dark && !plan.golden ? "bg-[#0f1535]" : ""}
              ${plan.golden ? "bg-[#1a1a2e]" : ""}
              ${!plan.dark && !plan.highlight ? "bg-white border border-gray-400" : ""}
            `}
          >
            {/* Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`
                  text-xs font-bold px-3 py-1 rounded-full
                  ${plan.highlight ? "bg-[#0f1535] text-white" : ""}
                  ${plan.dark && !plan.golden ? "bg-white/10 text-white" : ""}
                  ${plan.golden ? "bg-white/10 text-yellow-300" : ""}
                  ${!plan.dark && !plan.highlight ? "bg-gray-100 text-[#0f1535]" : ""}
                `}
              >
                {plan.badge}
              </span>
              {plan.golden && <span className="text-yellow-400 text-lg">💎</span>}
              {!plan.golden && (
                <span className={`text-xs ${plan.dark ? "text-white/30" : "text-gray-300"}`}>⊞</span>
              )}
            </div>

            {/* Plan name */}
            {plan.label && (
              <h3
                className={`text-3xl sm:text-4xl font-extrabold leading-tight
                  ${plan.golden ? "text-yellow-300" : plan.dark ? "text-white" : "text-[#0f1535]"}
                `}
              >
                {plan.label}
              </h3>
            )}

            {/* Tagline */}
            <p className={`text-xs leading-snug ${plan.dark ? "text-white/60" : "text-gray-400"}`}>
              {plan.tagline}
            </p>

            {/* Price */}
            <div>
              <span
                className={`text-4xl font-extrabold
                  ${plan.golden ? "text-yellow-300" : plan.dark ? "text-white" : "text-[#0f1535]"}
                `}
              >
                $ {plan.price}
              </span>
              <span className={`text-xs ml-1 ${plan.dark ? "text-white/50" : "text-gray-400"}`}>
                {plan.period}
              </span>
            </div>

            {/* Divider */}
            <hr className={`${plan.dark ? "border-white/10" : "border-gray-200"}`} />

            {/* Features */}
            <ul className="flex flex-col gap-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs">
                  <span className={`mt-0.5 ${plan.golden ? "text-yellow-400" : !plan.dark ? "text-[#3B4FE4]" : "text-white/70"}`}>
                    ✓
                  </span>
                  <span className={plan.dark ? "text-white/70" : "text-gray-500"}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`
                mt-auto w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                ${plan.highlight ? "bg-[#0f1535] text-white hover:bg-[#1a2550]" : ""}
                ${plan.dark && !plan.golden ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" : ""}
                ${plan.golden ? "bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 border border-yellow-400/30" : ""}
                ${!plan.dark && !plan.highlight ? "bg-[#0f1535] text-white hover:bg-[#1a2550]" : ""}
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