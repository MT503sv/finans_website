export default function balance() {
  const assets = 10000;
  const liabilities = 4000;
  const equity = assets - liabilities;

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US");

  return (
        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-4xl font-sans">

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-8">Balance Sheet</h2>

            {/* Table */}
            <div className="grid grid-cols-3 gap-2">
                {/* Headers */}
                <span className="text-base text-gray-500">Assets</span>
                <span className="text-base text-gray-500 text-center">Liabilities</span>
                <span className="text-base text-gray-500 text-right">Equity</span>

                {/* Divider */}
                <div className="col-span-3 border-t border-gray-300 my-2"></div> 

                {/* Values */}
                <span className="text-xl font-bold text-gray-900">{fmt(assets)}</span>
                <span className="text-xl font-bold text-gray-900 text-center">{fmt(liabilities)}</span>
                <span className="text-xl font-bold text-gray-900 text-right">{fmt(equity)}</span>
            </div>

            {/* Formula label */}
            <p className="text-base font-bold text-gray-900 mt-10">
                Equity = Assets - Liabilities
            </p>

            {/* Formula values */}
            <p className="text-base text-gray-300 mt-2 tracking-wide">
                {fmt(equity)} = {fmt(assets)} - {fmt(liabilities)}
            </p>

        </div>
  );
}