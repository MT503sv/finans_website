import Data from "./components/data/page";
import Balance from "./components/balance/page";
import ExpensesOverview from "./components/expenses-overview/page";
import Incomes from "./components/incomes/page";
import Goals from "./components/goals/page";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-200 text-black p-8 space-y-15">

      <div>
        <Data />
      </div>
        
      <div className="grid grid-cols-1 md:flex gap-15 ">
        <div className="flex-1">
          <Balance />
        </div>
        
        <div className="flex-1">
          <ExpensesOverview />
        </div>
      </div>
        
      <div className="flex justify-center">
        <Incomes />
      </div>

      <div>
        <Goals />
      </div>
    </main>
  );
}
