import {
  Wallet,
  BarChart3,
  Target,
  ScanText,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Track Easily",
    description:
      "Add income and expenses in seconds. Always know where your money goes.",
    bg: "bg-blue-50",
    iconColor: "text-[#010221]",
  },
  {
    icon: BarChart3,
    title: "See Your Progress",
    description:
      "Clear insights to better understand your finances and growth.",
    bg: "bg-purple-50",
    iconColor: "text-[#4F46E5]",
  },
  {
    icon: Target,
    title: "Reach Your Goals",
    description:
      "Build better habits and achieve your financial goals step by step.",
    bg: "bg-green-50",
    iconColor: "text-green-700",
  },
  {
    icon: ScanText,
    title: "Scan Your Notes",
    description:
      "Turn handwritten notes and receipts into digital data instantly.",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-white py-14 sm:py-22 px-4 sm:px-8 lg:px-16 mb-6 sm:mb-10">
      <div className="max-w-6xl mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="px-4 sm:px-5 py-2 rounded-full bg-[#C2D4FF] text-[#010221] text-xs sm:text-sm font-medium tracking-wide">
            EVERYTHING YOU NEED
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#000000]">
            Everything you need
            <br />
            to take{" "}
            <span className="text-[#C2D4FF]">
              control
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 leading-relaxed">
            Simple and powerful tools to manage your money
            and achieve your goals.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mt-10 sm:mt-16 px-0 lg:px-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="
                  group
                  bg-white
                  rounded-[16px]
                  border border-gray-100
                  p-6 sm:p-8
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                "
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${feature.bg} flex items-center justify-center`}
                >
                  <Icon
                    className={`${feature.iconColor} w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]`}
                  />
                </div>

                {/* Content */}
                <div className="mt-5 sm:mt-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#010221]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-gray-500 leading-7 text-sm sm:text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

 