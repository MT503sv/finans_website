import { getIncomes } from "./actions/incomes";
import Incomes from "./component/Incomes";

export default async function IncomesPage() {
  const initialIncomes = await getIncomes();
  return <Incomes initialIncomes={initialIncomes} />;
}