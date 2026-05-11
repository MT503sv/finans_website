'use client';

import { Download, ShoppingBag, Trash2 } from 'lucide-react';
import { SaleRecord } from '@/types';

interface SalesHistoryProps {
  records: SaleRecord[];
  onDelete: (id: string) => void;
}

export default function SalesHistory({ records, onDelete }: SalesHistoryProps) {
  const exportToCSV = () => {
    const headers = ['Date', 'Product', 'Category', 'Quantity', 'Price', 'Total'];
    const rows = records.map(r => [new Date(r.timestamp).toLocaleString('en-US'), r.productName, r.category, r.quantity, r.price.toFixed(2), (r.price * r.quantity).toFixed(2)]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (records.length === 0) return (
    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
      <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
      <p className="text-slate-500 font-medium">No sales recorded yet.</p>
      <p className="text-slate-400 text-sm">Scan a receipt to get started.</p>
    </div>
  );

  const totalSales = records.reduce((acc, r) => acc + r.price * r.quantity, 0);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <p className="text-xs text-slate-400 font-medium">{records.length} records</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-white transition-all shadow-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Grand Total
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100">Transactions</span>
          <p className="text-3xl font-black mt-2">{records.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Qty.</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {records.map((record) => (
                <tr key={record.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 line-clamp-1">{record.productName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{new Date(record.timestamp).toLocaleDateString('en-US')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-tighter">{record.category}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{record.quantity}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">${(record.price * record.quantity).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDelete(record.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}