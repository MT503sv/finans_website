import { PricingTable } from "@clerk/nextjs";
 
  export default function Pricing() {
    return (
      <main className="font-sans py-12 sm:py-16 px-4">
 
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-[#000000]">
            Plans for every
            <br />
            <span className="text-[#000000] mx-2">stage of your</span>
            <span className="text-[#C2D4FF] mx-2">business</span>
          </h1>
          <p className="mt-3 sm:mt-5 text-sm sm:text-base text-gray-500 leading-relaxed">
            Accessible plans for micro and small enterprises
          </p>
        </div>
 
        {/* Clerk Pricing Table */}
        <div
          className="max-w-5xl mx-auto"
          style={{
            ["--grid-min-size" as string]: "0rem",
            ["--clerk-pricing-table-grid-template-columns" as string]: "repeat(3, 1fr)",
          }}
        >
          <PricingTable
            appearance={{
              variables: {
                colorPrimary: "#010221",
                colorText: "#010221",
                borderRadius: "1.5rem",
                fontFamily: "inherit",
              },
              elements: {
                pricingTable: {
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  padding: "0",
                },
                pricingTableCard: {
                  borderRadius: "1.5rem",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  border: "1px solid #e5e7eb",
                  padding: "1.5rem",
                },
                pricingTableCard__highlighted: {
                  background: "#010221",
                  border: "none",
                  color: "white",
                },
                planTitle: {
                  fontSize: "2rem",
                  fontWeight: "800",
                  lineHeight: "1.2",
                },
                planPrice: {
                  fontSize: "2.25rem",
                  fontWeight: "800",
                },
                planActionButton: {
                  background: "#010221",
                  backgroundImage: "none",
                  borderRadius: "1rem",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  padding: "0.75rem",
                  boxShadow: "none",
                  filter: "none",
                  opacity: 1,
                },
              },
            }}
          />
        </div>
 
      </main>
    );
  }