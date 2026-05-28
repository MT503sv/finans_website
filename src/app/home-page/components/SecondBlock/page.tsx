import Image from "next/image";
 
const features = [
  {
    icon: "/homepage/Wallet.png",
    title: "Track easily",
    description: "Add income and expenses in seconds.",
  },
  {
    icon: "/homepage/Grafic.png",
    title: "See your progress",
    description: "Clear charts to understand your money.",
  },
  {
    icon: "/homepage/Target.png",
    title: "Reach your goals",
    description: "Set goals and build better financial habits.",
  },
  {
    icon: "/homepage/Scanner.png",
    title: "Scan your notes",
    description: "Turn handwritten notes into digital data instantly with OCR.",
  },
];

export default function SecondBlock() {
  return (
    <section className="font-sans py-16 px-4 bg-[F5F7FA]">
 
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
        Everything you need to take control
      </h2>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-gray-200"
          >
            <div className="mb-5">
              <Image src={feature.icon} alt={feature.title} width={44} height={44} />
            </div>
            <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
 
    </section>
  );
}
 