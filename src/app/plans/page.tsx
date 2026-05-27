import { PricingTable } from "@clerk/nextjs";

export default function Pricing() {
  return (

    <main className="page">
      <PricingTable
        appearance={{
          planActionButton: {
            background: "#010221",
            backgroundImage: 'none',
            opacity: 1,
            filter: 'none',
            boxShadow: 'none',
            
          },
          elements: {
            pricingTableCard: "plan-card",
            pricingTableCard__highlighted: "plan-card featured",
          },
        }}
      />
    </main>
  );
}