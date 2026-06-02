"use client";

import { useState, useRef, useEffect } from "react";
import { addDebt, deleteDebt, clearAllDebts } from "../actions/debts";

interface Debt {
  id: number;
  debt_bank: string;
  amount: number;
  due_date: Date;
  is_paid: boolean;
  date: Date;
}

function CalendarPicker({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const selected = value
    ? (() => { const [m, d, y] = value.split("/"); return `${y}-${m?.padStart(2, "0")}-${d?.padStart(2, "0")}`; })()
    : null;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const m = viewMonth + 1;
    const formatted = `${m}/${day}/${viewYear}`;
    onChange(formatted);
    onClose();
  };

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  return (
    <div ref={ref} className="absolute z-50 top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 text-sm">‹</button>
        <span className="text-sm font-semibold text-[#010221]">{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 text-sm">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center text-[10px] text-gray-400 font-medium py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSelected = dateStr === selected;
          return (
            <button
              key={day}
              onClick={() => selectDay(day)}
              className={`text-xs py-1 rounded-lg transition-colors ${isSelected ? "bg-[#010221] text-white font-semibold" : "hover:bg-gray-100 text-gray-700"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Debts({ initialDebts }: { initialDebts: Debt[] }) {
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showClearAll, setShowClearAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(debts.length / itemsPerPage);
  const paginated = debts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const menuRef = useRef<HTMLDivElement>(null);
  const clearAllRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDebts(initialDebts);
  }, [initialDebts]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
      if (clearAllRef.current && !clearAllRef.current.contains(e.target as Node)) setShowClearAll(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAmountChange = (val: string) => {
    if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) setAmount(val);
  };

  const handleDateInput = (val: string) => {
    const cleaned = val.replace(/[^\d/]/g, "");
    setDueDate(cleaned);
  };

  const isValidDate = (val: string) => {
    const parts = val.split("/");
    if (parts.length !== 3) return false;
    const [m, d, y] = parts.map(Number);
    if (!m || !d || !y) return false;
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  };

  const handleAdd = async () => {
    const missing = [];
    if (!creditor.trim()) missing.push("Creditor");
    if (!amount || parseFloat(amount) <= 0) missing.push("Amount");

    if (!dueDate) {
      missing.push("Due Date");
    } else if (!isValidDate(dueDate)) {
      setError("The date entered is not valid. Please use the format M/D/YYYY (e.g. 5/20/2026).");
      return;
    }

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      await addDebt({
        debt_bank: creditor.trim(),
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        due_date: dueDate,
      });
      setCreditor("");
      setAmount("");
      setDueDate("");
      setError("");
      setCurrentPage(1);
    } catch {
      setError("Error saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteDebt(id);
    setOpenMenu(null);
  };

  const handleClearAll = async () => {
    await clearAllDebts();
    setShowClearAll(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#010221]">Debts</h1>
        <p className="text-sm text-gray-500 mt-0.5">Keep track of what you owe in a simple way</p>
      </div>

      {/* Add Debt Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">

          {/* Creditor */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Debt</label>
            <input
              type="text"
              placeholder="Enter debt"
              value={creditor}
              onChange={e => setCreditor(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#010221] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#010221]/20 focus:border-[#010221] transition-all"
            />
          </div>

          {/* Amount */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#010221]/20 focus-within:border-[#010221] transition-all">
              <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={e => handleAmountChange(e.target.value)}
                className="flex-1 px-3 py-2 text-sm text-[#010221] placeholder-gray-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="flex-1 relative">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Due Date</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#010221]/20 focus-within:border-[#010221] transition-all">
              <button
                type="button"
                onClick={() => setShowCalendar(v => !v)}
                className="px-3 py-2 text-gray-400 bg-gray-50 border-r cursor-pointer border-gray-200 hover:text-[#010221] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="M/D/YYYY"
                value={dueDate}
                onChange={e => handleDateInput(e.target.value)}
                className="flex-1 px-3 py-2 text-sm text-[#010221] placeholder-gray-300 focus:outline-none"
              />
            </div>
            {showCalendar && (
              <CalendarPicker
                value={dueDate}
                onChange={setDueDate}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>
        </div>

        {/* Add button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleAdd}
            className="bg-[#010221] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#010221]/85 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            {loading ? "Saving..." : "Add Debt +"}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {error}
          </p>
        )}
      </div>

      {/* Debts History Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#010221]">Debts History</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-5">All your recorded debts.</p>

        <div className="w-full">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1fr_1fr_40px] border-b border-gray-200 pb-2 mb-1">
            <span className="text-xs font-semibold text-[#010221] px-2">Creditor</span>
            <span className="text-xs font-semibold text-[#010221] px-2">Amount</span>
            <span className="text-xs font-semibold text-[#010221] px-2">Due Date</span>
            <div className="relative flex justify-center" ref={clearAllRef}>
              <button
                onClick={() => setShowClearAll(v => !v)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-[#010221] transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                </svg>
              </button>
              {showClearAll && (
                <div className="absolute z-50 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-36">
                  <button
                    onClick={clearAll}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Clear all debts
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-400">No debts recorded yet.</div>
          ) : (
            paginated.map((debt) => (
              <div
                key={debt.id}
                className="grid grid-cols-[1fr_1fr_1fr_40px] py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg"
              >
                <span className="text-sm text-[#010221] px-2">{debt.debt_bank}</span>
                <span className="text-sm text-red-400 font-medium px-2">${debt.amount.toFixed(2)}</span>
                <span className="text-sm text-gray-600 px-2">
                  {new Date(debt.due_date).toLocaleDateString()}
                </span>
                <div className="relative flex justify-center" ref={openMenu === String(debt.id) ? menuRef : undefined}>
                  <button
                    onClick={() => setOpenMenu(openMenu === String(debt.id) ? null : String(debt.id))}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-[#010221] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                  {openMenu === String(debt.id) && (
                    <div className="absolute z-50 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-32">
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-[#010221] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}