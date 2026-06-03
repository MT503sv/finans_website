import { getSales } from "./actions/sales";
import Sales from "./component/Sales";

export default async function SalesPage() {
  const initialSales = await getSales();
  return <Sales initialSales={initialSales} />;
}