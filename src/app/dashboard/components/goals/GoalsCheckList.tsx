"use client";

import { useState } from "react";

type Goal = {
  id: number;
  goal_name: string;
  due_date: string | null;
  is_completed: boolean;
};

function getDateLabel(dueDateStr: string | null, isCompleted: boolean): {
  label: string;
  isOverdue: boolean;
} {
  if (isCompleted) return { label: "Finished", isOverdue: false };
  if (!dueDateStr)  return { label: "No due date", isOverdue: false };

    const now      = new Date();
    const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [year, month, day] = dueDateStr.split("T")[0].split("-").map(Number);
    const dueDay = new Date(year, month - 1, day);
    const diffDays = Math.round((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1)  return { label: "Tomorrow", isOverdue: false };
  if (diffDays === 0)  return { label: "Today",    isOverdue: false };
  if (diffDays === -1) return { label: "Yesterday", isOverdue: true };
  if (diffDays < -1) {
    const formatted = dueDay.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
    return { label: formatted, isOverdue: true };
  }

  const formatted = dueDay.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
  return { label: formatted, isOverdue: false };
}

export function GoalsChecklist({ goals: initial }: { goals: Goal[] }) {
  const [goals, setGoals] = useState(initial);

  const toggle = async (id: number) => {
    // Optimistic update
    setGoals(prev =>
      prev.map(g => g.id === id ? { ...g, is_completed: !g.is_completed } : g)
    );

    await fetch("/api/goals/toggle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Goals</h2>
        <span className="text-sm font-semibold text-gray-900 cursor-pointer hover:underline">
          View All Goals
        </span>
      </div>

      <div className="space-y-4">
        {goals.map(goal => {
          const { label, isOverdue } = getDateLabel(goal.due_date, goal.is_completed);
          const isRed = isOverdue && !goal.is_completed;

          return (
            <div key={goal.id} className="flex items-center gap-3">

              {/* Bubble */}
              <button
                onClick={() => toggle(goal.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  goal.is_completed
                    ? "bg-slate-900 border-slate-900"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {goal.is_completed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Texto */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  goal.is_completed
                    ? "line-through text-blue-200"
                    : isRed
                    ? "text-red-500"
                    : "text-gray-900"
                }`}>
                  {goal.goal_name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {/* Icono reloj */}
                  <svg className={`w-3 h-3 ${isRed ? "text-red-400" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 6v6l4 2" />
                  </svg>
                  <span className={`text-xs ${isRed ? "text-red-400" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
              </div>

            </div>
          );
        })}

        {goals.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No goals yet</p>
        )}
      </div>
    </div>
  );
}