"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Target, Plus, Trash2, Pencil, CheckCircle2, Circle, CalendarIcon } from "lucide-react";
import { addGoal, updateGoal, deleteGoal, toggleGoal } from "./actions/goals";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Goal {
  id: number;
  goal_name: string;
  due_date: Date;
  target_amount: number | null;
  is_completed: boolean;
  date: Date;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function pickerValueToIso(val: string) {
  const [m, d, y] = val.split("/");
  return `${y}-${m?.padStart(2, "0")}-${d?.padStart(2, "0")}`;
}

function dateToPickerValue(date: Date) {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function isValidDate(val: string) {
  const parts = val.split("/");
  if (parts.length !== 3) return false;
  const [m, d, y] = parts.map(Number);
  if (!m || !d || !y || y < 1000) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

// ─── Calendar Picker ──────────────────────────────────────────────────────────

function CalendarPicker({
  value, onChange, onClose,
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

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const selectDay = (day: number) => { onChange(`${viewMonth + 1}/${day}/${viewYear}`); onClose(); };
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  return (
    <div ref={ref} className="absolute z-[9999] bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 text-sm cursor-pointer">‹</button>
        <span className="text-sm font-semibold text-[#010221]">{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 text-sm cursor-pointer">›</button>
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
            <button key={day} onClick={() => selectDay(day)}
              className={`text-xs py-1 rounded-lg transition-colors cursor-pointer ${isSelected ? "bg-[#010221] text-white font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Goal Modal ───────────────────────────────────────────────────────────────

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { goal_name: string; due_date: string; target_amount: number }) => Promise<void>;
  initial?: Goal | null;
}

function GoalModal({ open, onClose, onSave, initial }: GoalModalProps) {
  const [title,   setTitle]   = useState(() => initial?.goal_name ?? "");
  const [dateVal, setDateVal] = useState(() => initial?.due_date ? dateToPickerValue(initial.due_date) : "");
  const [amount,  setAmount]  = useState(() => initial?.target_amount?.toString() ?? "");
  const [showCal, setShowCal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState<{ title?: string; date?: string; amount?: string }>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  const isEdit = !!initial;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleAmountChange = (val: string) => {
    if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) setAmount(val);
    if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
  };

  const previewLabel = (() => {
    if (!dateVal) return null;
    const parts = dateVal.split("/");
    if (parts.length !== 3 || !parts[2] || parts[2].length < 4) return null;
    try { return format(new Date(pickerValueToIso(dateVal)), "MMMM d, yyyy"); }
    catch { return null; }
  })();

  async function handleSave() {
    const newErrors: { title?: string; date?: string; amount?: string } = {};
    if (!title.trim()) newErrors.title = "Goal name is required.";
    if (!dateVal) newErrors.date = "Target date is required.";
    else if (!isValidDate(dateVal)) newErrors.date = "Invalid date. Use M/D/YYYY (e.g. 5/20/2026).";
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Enter a valid amount greater than 0.";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      await onSave({
        goal_name: title.trim(),
        due_date: pickerValueToIso(dateVal),
        target_amount: parseFloat(parseFloat(amount).toFixed(2)),
      });
      onClose();
    } catch {
      setErrors({ title: "Error saving. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const inputBase = "w-full border rounded-lg px-3 py-2.5 text-sm text-[#010221] placeholder-gray-300 focus:outline-none focus:ring-2 transition-all";
  const inputOk   = "border-gray-200 focus:ring-gray-200 focus:border-gray-300";
  const inputErr  = "border-red-300 focus:ring-red-100 focus:border-red-300";
  const wrapOk    = "flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-200 focus-within:border-gray-300 transition-all";
  const wrapErr   = "flex items-center border border-red-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-300 transition-all";

  return (
    <div ref={overlayRef} onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="px-7 pt-7 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-[#010221] text-lg font-bold leading-tight">{isEdit ? "Edit Goal" : "Add New Goal"}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{isEdit ? "Update your goal details" : "Set a new financial target"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-7 py-6">

          {/* Goal name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium">Goal name</label>
            <input type="text" placeholder="e.g. Buy new equipment" value={title}
              onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(p => ({ ...p, title: undefined })); }}
              className={`${inputBase} ${errors.title ? inputErr : inputOk}`} />
            {errors.title && <ErrorMsg>{errors.title}</ErrorMsg>}
          </div>

          {/* Target date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium">Target date</label>
            <div className="relative">
              <div className={errors.date ? wrapErr : wrapOk}>
                <button type="button" onClick={() => setShowCal(v => !v)}
                  className="px-3 py-2.5 text-gray-400 bg-gray-50 border-r border-gray-200 hover:text-[#010221] transition-colors cursor-pointer flex items-center focus:outline-none">
                  <CalendarIcon size={14} />
                </button>
                <input type="text" placeholder="M/D/YYYY" value={dateVal}
                  onChange={e => { setDateVal(e.target.value.replace(/[^\d/]/g, "")); if (errors.date) setErrors(p => ({ ...p, date: undefined })); }}
                  className="flex-1 px-3 py-2.5 text-sm text-[#010221] placeholder-gray-300 focus:outline-none min-w-0 bg-white" />
              </div>
              {showCal && (
                <CalendarPicker value={dateVal}
                  onChange={v => { setDateVal(v); setErrors(p => ({ ...p, date: undefined })); }}
                  onClose={() => setShowCal(false)} />
              )}
            </div>
            {errors.date && <ErrorMsg>{errors.date}</ErrorMsg>}
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium">Amount ($)</label>
            <div className={errors.amount ? wrapErr : wrapOk}>
              <span className="px-3 py-2.5 text-sm text-gray-400 bg-gray-50 border-r border-gray-200">$</span>
              <input type="text" inputMode="decimal" placeholder="0.00" value={amount}
                onChange={e => handleAmountChange(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm text-[#010221] placeholder-gray-300 focus:outline-none min-w-0" />
            </div>
            {errors.amount && <ErrorMsg>{errors.amount}</ErrorMsg>}
          </div>

          {previewLabel && !errors.date && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-500">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Target</span>
              <span className="font-semibold text-[#010221]">{previewLabel}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-7 pb-7 pt-0">
          <button onClick={onClose}
            className="flex-1 rounded-lg h-11 text-sm font-semibold border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 rounded-lg h-11 text-sm font-semibold bg-[#010221] hover:bg-[#010221]/90 text-white cursor-pointer transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Saving..." : isEdit ? "Save changes" : "Add Goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
      </svg>
      {children}
    </p>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function GoalsClient({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals,       setGoals]       = useState<Goal[]>(initialGoals);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [openMenu,    setOpenMenu]    = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const completed = goals.filter(g => g.is_completed).length;
  const total     = goals.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function openAdd() { setEditingGoal(null); setModalOpen(true); }
  function openEdit(goal: Goal) {
    if (goal.id < 0) return;
    setEditingGoal(goal); setModalOpen(true); setOpenMenu(null);
  }
  function handleClose() { setModalOpen(false); setEditingGoal(null); }

  async function handleSave(data: { goal_name: string; due_date: string; target_amount: number }) {
    if (editingGoal) {
      setGoals(prev => prev.map(g =>
        g.id === editingGoal.id
          ? { ...g, goal_name: data.goal_name, due_date: new Date(data.due_date), target_amount: data.target_amount }
          : g
      ));
      await updateGoal(editingGoal.id, data);
    } else {
      const tempId = -Date.now();
      setGoals(prev => [{
        id: tempId,
        goal_name: data.goal_name,
        due_date: new Date(data.due_date),
        target_amount: data.target_amount,
        is_completed: false,
        date: new Date(),
      }, ...prev]);
      const saved = await addGoal(data);
      if (saved?.id) {
        setGoals(prev => prev.map(g => g.id === tempId ? { ...g, id: saved.id } : g));
      }
    }
  }

  async function handleDelete(id: number) {
    setGoals(prev => prev.filter(g => g.id !== id));
    setOpenMenu(null);
    if (id < 0) return;
    await deleteGoal(id);
  }

  async function handleToggle(id: number, current: boolean) {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, is_completed: !current } : g));
    if (id < 0) return;
    await toggleGoal(id, !current);
  }

  const DropdownMenu = ({ goalId, goal }: { goalId: number; goal: Goal }) => (
    <div className="relative flex justify-center" ref={openMenu === goalId ? menuRef : undefined}>
      <button onClick={() => setOpenMenu(openMenu === goalId ? null : goalId)}
        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
        </svg>
      </button>
      {openMenu === goalId && (
        <div className="absolute z-50 top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-32">
          <button onClick={() => openEdit(goal)}
            className="w-full text-left px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 font-medium transition-colors flex items-center gap-2 cursor-pointer">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => handleDelete(goal.id)}
            className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 font-medium transition-colors flex items-center gap-2 cursor-pointer">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-[#010221] sm:text-2xl">My Goals</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your path to building a stronger business</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#010221] hover:bg-[#010221]/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0">
          <Plus size={15} />
          Add Goal
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#010221] rounded-full transition-all duration-500"
            style={{ width: total ? `${(completed / total) * 100}%` : "0%" }} />
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{completed}/{total} completed</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

        {/* Header — solo desktop */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_40px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Goals</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Target date</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Amount</span>
          <span />
        </div>

        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <Target size={36} strokeWidth={1.5} />
            <p className="text-sm">No goals yet. Add one to get started!</p>
          </div>
        )}

        {goals.map((goal, i) => (
          <div key={goal.id}
            className={`px-4 sm:px-6 py-4 transition-colors hover:bg-gray-50/50 overflow-visible ${
              i !== goals.length - 1 ? "border-b border-gray-100" : ""
            }`}>

            {/* ── Mobile layout ── */}
            <div className="flex items-center gap-3 sm:hidden">
              <button onClick={() => handleToggle(goal.id, goal.is_completed)}
                className="flex-shrink-0 text-gray-300 hover:text-[#010221] transition-colors cursor-pointer">
                {goal.is_completed
                  ? <CheckCircle2 size={18} className="text-[#010221]" />
                  : <Circle size={18} />}
              </button>
              <div className="w-8 h-8 rounded-lg bg-[#010221] flex items-center justify-center flex-shrink-0">
                <Target size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm block truncate ${goal.is_completed ? "line-through text-gray-400" : "text-[#010221] font-medium"}`}>
                  {goal.goal_name}
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <CalendarIcon size={11} />
                    {formatDate(goal.due_date)}
                  </span>
                  <span className={`text-xs font-semibold ${goal.is_completed ? "line-through text-gray-400" : "text-[#010221]"}`}>
                    ${(goal.target_amount ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <DropdownMenu goalId={goal.id} goal={goal} />
            </div>

            {/* ── Desktop layout ── */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_40px] gap-4 items-center">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => handleToggle(goal.id, goal.is_completed)}
                  className="flex-shrink-0 text-gray-300 hover:text-[#010221] transition-colors cursor-pointer">
                  {goal.is_completed
                    ? <CheckCircle2 size={18} className="text-[#010221]" />
                    : <Circle size={18} />}
                </button>
                <div className="w-8 h-8 rounded-lg bg-[#010221] flex items-center justify-center flex-shrink-0">
                  <Target size={14} className="text-white" />
                </div>
                <span className={`text-sm truncate ${goal.is_completed ? "line-through text-gray-400" : "text-[#010221] font-medium"}`}>
                  {goal.goal_name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarIcon size={13} className="text-gray-400 flex-shrink-0" />
                <span className={goal.is_completed ? "text-gray-400" : ""}>{formatDate(goal.due_date)}</span>
              </div>
              <div className={`text-right text-sm font-semibold ${goal.is_completed ? "line-through text-gray-400" : "text-[#010221]"}`}>
                ${(goal.target_amount ?? 0).toLocaleString()}
              </div>
              <DropdownMenu goalId={goal.id} goal={goal} />
            </div>

          </div>
        ))}
      </div>

      <GoalModal
        key={modalOpen ? (editingGoal?.id ?? "new") : "closed"}
        open={modalOpen}
        onClose={handleClose}
        onSave={handleSave}
        initial={editingGoal}
      />
    </div>
  );
}