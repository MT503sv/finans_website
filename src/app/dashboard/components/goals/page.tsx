// components/Goals.tsx

const goals = [
  { label: "Increase Sales by 10%",                progress: 60,  color: "#2d2f6b" },
  { label: "Reduce merchandise cost by 3%",         progress: 40,  color: "#3d3f8f" },
  { label: "Set aside 10% of sales for emergencies",progress: 50,  color: "#4a4c9e" },
  { label: "Get 8 new customers during the month",  progress: 80,  color: "#8b8dc4" },
  { label: "Lower basic services bills by $5",      progress: 30,  color: "#c0c2e0" },
];

export default function Goals() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full ">
      <h2 className="text-base font-bold text-gray-900 mb-6">Goals</h2>

      <div className="flex flex-col gap-4">
        {goals.map((goal, i) => (
          <div key={i} className="flex items-center gap-4">

            {/* Circulito */}
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: goal.color }}
            />

            {/* Nombre del goal */}
            <span className="text-sm text-gray-600 w-64 shrink-0">{goal.label}</span>

            {/* Barra de progreso */}
            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${goal.progress}%`,
                  backgroundColor: goal.color,
                }}
              />
            </div>

            {/* Porcentaje */}
            <span className="text-sm font-bold text-gray-900 w-10 text-right shrink-0">
              {goal.progress}%
            </span>

          </div>
        ))}
      </div>

      {/* View All Goals */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button className="text-sm font-semibold text-gray-900 hover:underline">
          View All Goals
        </button>
        <span className="text-gray-900">→</span>
      </div>
    </div>
  );
}