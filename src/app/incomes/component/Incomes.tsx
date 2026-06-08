"use client";

import { useState, useRef, useEffect } from "react";
import { addIncome, deleteIncome, clearAllIncomes } from "../actions/incomes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IncomeType = "Sale" | "Donation" | "Service" | "Investment" | "Other";

interface Income {
  id: number;
  income_type: string;
  amount: number;
  date: Date;
  description: string | null;
}

const INCOME_TYPES: IncomeType[] = ["Sale", "Donation", "Service", "Investment", "Other"];

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
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const selected = value
    ? (() => {
        const [m, d, y] = value.split("/");
        return `${y}-${m?.padStart(2, "0")}-${d?.padStart(2, "0")}`;
      })()
    : null;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
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
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
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

export default function Incomes({ initialIncomes }: { initialIncomes: Income[] }) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [incomeType, setIncomeType] = useState<IncomeType>("Sale");
  const [amount, setAmount] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showClearAll, setShowClearAll] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(incomes.length / itemsPerPage);
  const paginated = incomes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const menuRef = useRef<HTMLDivElement>(null);
  const clearAllRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
      if (clearAllRef.current && !clearAllRef.current.contains(e.target as Node)) setShowClearAll(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Fix: lee la fecha en UTC para evitar desfase por timezone (ej. El Salvador UTC-6)
  const formatIncomeDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    return `${month}/${day}/${year}`;
  };

  const handleAmountChange = (val: string) => {
    if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) setAmount(val);
  };

  const handleDateInput = (val: string) => {
    const cleaned = val.replace(/[^\d/]/g, "");
    setDateReceived(cleaned);
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
    if (!amount || parseFloat(amount) <= 0) missing.push("Amount");

    if (!dateReceived) {
      missing.push("Date Received");
    } else if (!isValidDate(dateReceived)) {
      setError("The date entered is not valid. Please use the format M/D/YYYY (e.g. 5/20/2026).");
      return;
    }

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      await addIncome({
        income_type: incomeType,
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        date: dateReceived,
        description: description.trim() || undefined,
      });

      const [m, d, y] = dateReceived.split("/");
      setIncomes(prev => [{
        id: Date.now(),
        income_type: incomeType,
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        date: new Date(`${y}-${m?.padStart(2, "0")}-${d?.padStart(2, "0")}`),
        description: description.trim() || null,
      }, ...prev]);

      setIncomeType("Sale");
      setAmount("");
      setDateReceived("");
      setDescription("");
      setError("");
      setCurrentPage(1);
    } catch {
      setError("Error saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteIncome(id);
    setIncomes(prev => prev.filter(i => i.id !== id));
    setOpenMenu(null);
  };

  const handleClearAll = async () => {
    await clearAllIncomes();
    setIncomes([]);
    setShowClearAll(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#010221] sm:text-2xl">Add income</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track incomes to have a better understanding of your finances</p>
      </div>

      {/* Add Income Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Product type</label>
            <Select value={incomeType} onValueChange={(val) => setIncomeType(val as IncomeType)}>
              <SelectTrigger className="w-full bg-white border border-gray-200 rounded-lg text-sm text-[#010221] focus:ring-2 focus:ring-[#010221]/20 focus:border-[#010221] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-[#010221]/20 data-[state=open]:border-[#010221]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4} className="bg-white border border-gray-200 rounded-xl shadow-lg">
                {INCOME_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="text-sm text-[#010221] focus:bg-gray-100 focus:text-[#010221] data-[highlighted]:bg-gray-100 cursor-pointer">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount received</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#010221]/20 focus-within:border-[#010221] transition-all">
              <span className="px-3 py-2 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">$</span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="flex-1 px-3 py-2 text-sm text-[#010221] placeholder-gray-300 focus:outline-none min-w-0"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Date received</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#010221]/20 focus-within:border-[#010221] transition-all">
              <button
                type="button"
                onClick={() => setShowCalendar((v) => !v)}
                className="px-3 py-2 text-gray-400 cursor-pointer bg-gray-50 border-r border-gray-200 hover:text-[#010221] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="M/D/YYYY"
                value={dateReceived}
                onChange={(e) => handleDateInput(e.target.value)}
                className="flex-1 px-3 py-2 text-sm text-[#010221] placeholder-gray-300 focus:outline-none min-w-0"
              />
            </div>
            {showCalendar && (
              <CalendarPicker
                value={dateReceived}
                onChange={setDateReceived}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Description <span className="text-gray-300">(optional)</span>
            </label>
            <input
              type="text"
              placeholder=""
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#010221] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#010221]/20 focus:border-[#010221] transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full sm:w-auto bg-[#010221] cursor-pointer text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#010221]/85 active:scale-95 transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Add income +"}
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

      {/* Incomes Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[#010221]">Income History</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-5">History of all your added income.</p>

        <div className="w-full">
          <div className="grid grid-cols-[1fr_40px] xs:grid-cols-[1fr_1fr_40px] sm:grid-cols-[1fr_1fr_1fr_40px] lg:grid-cols-[1fr_1.5fr_1fr_1fr_40px] border-b border-gray-200 pb-2 mb-1">
            <span className="text-xs font-semibold text-[#010221] px-2">Type</span>
            <span className="hidden lg:block text-xs font-semibold text-[#010221] px-2">Description</span>
            <span className="hidden xs:block text-xs font-semibold text-[#010221] px-2">Amount</span>
            <span className="hidden sm:block text-xs font-semibold text-[#010221] px-2">Date</span>
            <div className="relative flex justify-center" ref={clearAllRef}>
              <button
                onClick={() => setShowClearAll((v) => !v)}
                className="p-1 rounded-md cursor-pointer hover:bg-gray-100 text-gray-400 hover:text-[#010221] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                </svg>
              </button>
              {showClearAll && (
                <div className="absolute z-50 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-36">
                  <button
                    onClick={handleClearAll}
                    className="w-full text-left px-4 py-2.5 cursor-pointer text-xs text-red-500 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Clear all incomes
                  </button>
                </div>
              )}
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-400">No incomes recorded yet.</div>
          ) : (
            paginated.map((income) => (
              <div
                key={income.id}
                className="grid grid-cols-[1fr_40px] xs:grid-cols-[1fr_1fr_40px] sm:grid-cols-[1fr_1fr_1fr_40px] lg:grid-cols-[1fr_1.5fr_1fr_1fr_40px] py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg items-center"
              >
                <div className="px-2">
                  <span className="text-sm text-[#010221] block">{income.income_type}</span>
                  {/* ✅ Mobile: fecha corregida sin desfase de timezone */}
                  <span className="text-xs text-green-500 font-medium block xs:hidden">
                    ${income.amount.toFixed(2)} · {formatIncomeDate(income.date)}
                  </span>
                </div>

                <span className="hidden lg:block text-sm text-gray-500 px-2 truncate">
                  {income.description || "---"}
                </span>

                <span className="hidden xs:block text-sm text-green-500 font-medium px-2">
                  ${income.amount.toFixed(2)}
                </span>

                {/* ✅ Date: fecha corregida sin desfase de timezone */}
                <span className="hidden sm:block text-sm text-gray-600 px-2">
                  {formatIncomeDate(income.date)}
                </span>

                <div className="relative flex justify-center" ref={openMenu === String(income.id) ? menuRef : undefined}>
                  <button
                    onClick={() => setOpenMenu(openMenu === String(income.id) ? null : String(income.id))}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-[#010221] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                  {openMenu === String(income.id) && (
                    <div className="absolute z-50 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-32">
                      <button
                        onClick={() => handleDelete(income.id)}
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

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "bg-[#010221] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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