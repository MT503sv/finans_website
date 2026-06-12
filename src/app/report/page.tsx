"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowDownCircle,
  FileText,
  Sheet,
  X,
  CheckCircle2,
} from "lucide-react";

export default function ReportsPage() {
  const { user, isLoaded } = useUser();

  const [selectedReport, setSelectedReport] = useState("");
  const [step, setStep] = useState<"idle" | "calendar" | "loading" | "done">("idle");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [files, setFiles] = useState({ pdf: "", excel: "" });

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (step !== "idle" && step !== "loading") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [step]);

  useEffect(() => {
    const scrollableEl = document.querySelector('[data-sidebar="inset"]') as HTMLElement;
    if (scrollableEl) scrollableEl.style.overflow = "hidden";
    return () => {
      if (scrollableEl) scrollableEl.style.overflow = "";
    };
  }, []);

  // FIX: Use local date parts explicitly to avoid UTC shift (e.g. midnight local
  // becoming the previous day when converted to UTC by toISOString / date-fns).
  function formatDate(d?: Date): string {
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  async function generateReport() {
    if (!date?.from || !date?.to || !selectedReport) return;
    if (!isLoaded || !user) return;

    setStep("loading");

    try {
      const res = await fetch(`${API}/generate_report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          report_type: selectedReport,
          start_date: formatDate(date.from),
          end_date: formatDate(date.to),
        }),
      });

      if (!res.ok) throw new Error("Error generating report");

      const data = await res.json();
      setFiles({ pdf: data.pdf, excel: data.excel });
      setStep("done");
    } catch (error) {
      console.error(error);
      setStep("idle");
    }
  }

  function closeModal() {
    setStep("idle");
    setDate(undefined);
    setSelectedReport("");
  }

  const reports = [
    {
      name: "Incomes",
      value: "incomes",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-100",
      hover: "hover:border-green-300 hover:bg-green-50/60",
    },
    {
      name: "Sales",
      value: "sales",
      icon: ShoppingCart,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      hover: "hover:border-indigo-300 hover:bg-indigo-50/60",
    },
    {
      name: "Profit",
      value: "profit",
      icon: TrendingUp,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      hover: "hover:border-yellow-300 hover:bg-yellow-50/60",
    },
    {
      name: "Expense",
      value: "expenses",
      icon: ArrowDownCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
      hover: "hover:border-red-300 hover:bg-red-50/60",
    },
  ];

  return (
    <main className="min-h-full bg-white flex flex-col p-6 md:p-10">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-[#010221] sm:text-2xl">Reports</h1>
      </div>

      {/* IDLE */}
      {step === "idle" && (
        <div className="flex flex-col items-center justify-start pt-4 md:pt-12 flex-1">

          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm mt-1">
              Choose an option for your report
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 w-full max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              {reports.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    onClick={() => {
                      setSelectedReport(r.value);
                      setStep("calendar");
                    }}
                    disabled={!isLoaded || !user}
                    className={`flex items-center gap-3 px-3 py-4 rounded-2xl border ${r.border} bg-white ${r.hover} transition-all duration-200 cursor-pointer group disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.bg} shrink-0`}>
                      <Icon size={18} className={r.color} />
                    </div>
                    <span className="text-sm font-semibold text-[#010221] truncate">
                      {r.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* CALENDAR MODAL */}
      {step === "calendar" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-xl my-8">

            <div className="flex items-center justify-between px-7 pt-6 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#010221]">Select date range</h2>
                <p className="text-gray-400 text-xs mt-0.5 capitalize">
                  {selectedReport} report period
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={15} className="text-gray-500" />
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-7" />

            <div className="px-7 py-5">
              <div className="overflow-x-auto flex justify-center">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  className="mx-auto"
                  required={false}
                  disabled={{ after: new Date() }}
                />
              </div>

              {date?.from && date?.to && (
                <div className="mt-4 flex items-center justify-center gap-2 bg-gray-50 rounded-2xl px-4 py-2.5">
                  <span className="text-xs text-gray-400">From</span>
                  <span className="text-xs font-semibold text-[#010221]">{format(date.from, "PPP")}</span>
                  <span className="text-xs text-gray-300">→</span>
                  <span className="text-xs font-semibold text-[#010221]">{format(date.to, "PPP")}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-7 pb-7">
              <button
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-[#010221] text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-2xl bg-[#010221] text-white text-sm font-medium hover:bg-[#1b1d42] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={generateReport}
                disabled={!date?.from || !date?.to}
              >
                Generate Report
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LOADING MODAL */}
      {step === "loading" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white px-12 py-10 rounded-3xl shadow-xl flex flex-col items-center gap-5">
            <div className="w-11 h-11 border-[3px] border-[#010221] border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#010221]">Generating your report</p>
              <p className="text-xs text-gray-400 mt-1">This may take a few seconds...</p>
            </div>
          </div>
        </div>
      )}

      {/* DONE MODAL */}
      {step === "done" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-xl overflow-hidden">

            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                <h2 className="text-base font-bold text-[#010221]">Report ready</h2>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={15} className="text-gray-500" />
              </button>
            </div>

            <div className="h-px bg-gray-100 mx-6" />

            <div className="p-6 flex flex-col gap-3">

              <a
                href={files.pdf}
                download={`${selectedReport}_report.pdf`}
                className="flex items-center gap-4 bg-[#010221] text-white px-4 py-3.5 rounded-2xl hover:opacity-90 transition cursor-pointer"
              >
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Download PDF</p>
                  <p className="text-xs text-white/50">{selectedReport}_report.pdf</p>
                </div>
              </a>

              <a
                href={files.excel}
                download={`${selectedReport}_report.xlsx`}
                className="flex items-center gap-4 bg-gray-50 border border-gray-100 text-[#010221] px-4 py-3.5 rounded-2xl hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <Sheet size={16} className="text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Download Excel</p>
                  <p className="text-xs text-gray-400">{selectedReport}_report.xlsx</p>
                </div>
              </a>

              <button
                onClick={closeModal}
                className="text-xs text-gray-400 hover:text-gray-600 transition mt-1 cursor-pointer py-1"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}