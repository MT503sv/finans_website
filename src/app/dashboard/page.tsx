import Data from "./components/data/page";
import Goals from "./components/goals/page";
import ExpensesOverview from "./components/expenses-overview/page";
import Incomes from "./components/incomes/page";


export default function Dashboard() {
  return (
    <main className="min-h-screen bg-white text-black p-5 space-y-15 ">

      <div>
        <Data />
      </div>
        
      <div className="grid grid-cols-1 md:flex gap-15 ">
        <div className="flex-1">
          <Goals />
        </div>
        
        <div className="flex-1">
          <ExpensesOverview />
        </div>
      </div>
        
      <div className="flex justify-center">
        <Incomes />
      </div>

    </main>
  );
}
