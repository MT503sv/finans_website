import { getExpenses } from "./actions/expenses";
import Expenses from "./component/Expenses";

export default async function ExpensesPage() {
  const initialExpenses = await getExpenses();
  return <Expenses initialExpenses={initialExpenses} />;
}