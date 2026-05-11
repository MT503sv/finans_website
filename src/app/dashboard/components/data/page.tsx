export default function data() {
    const balance = 6000;
    const incomes = 5430;
    const expenses = 2120;
    const profit = incomes - expenses;

    const fmt = (n: number)=>
         "$" + n.toLocaleString("en-US");

  return (
    <main className="text-black font-sans">
      <div className="">
            {/* Dashboard text */}
            <div className="mt-4">
                <h1 className="text-4xl font-semibold">Dashboard</h1>
            </div>

            {/* description text */}
            <div className="mt-4 text-lg">
                <h2>Here's your financial summary</h2>
            </div>

            {/* Summary blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-15 mt-10">

                {/* Balance Sheet */}
                <div className="bg-slate-950 shadow-lg rounded-lg p-5">
                    <h2 className="text-white font-bold text-xs">Balance</h2>
                    <h2 className="text-white font-bold text-2xl">{fmt(balance)}</h2>
                </div>

                {/* Incomes */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h2 className="font-semibold">Incomes</h2>
                    <h2 className="font-bold text-2xl">{fmt(incomes)}</h2>
                </div>

                {/* Expenses */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h2 className="font-semibold">Expenses</h2>
                    <h2 className="font-bold text-2xl">{fmt(expenses)}</h2>
                </div>

                {/* Profit */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h2 className="font-semibold">Profit</h2>
                    <h2 className="font-bold text-2xl">{fmt(profit)}</h2>
                </div>
            
            </div>
      </div>
    </main>
  );
}