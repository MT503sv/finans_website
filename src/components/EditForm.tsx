'use client';

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { ExtractedData, Category, SaleRecord } from '@/types';

interface EditFormProps {
    data: ExtractedData;
    onSave: (records: SaleRecord[]) => void;
    onCancel: () => void;
}

export default function EditForm({ data, onSave, onCancel }: EditFormProps) {
    const [items, setItems] = useState<ExtractedData['items']>(data.items);
    const [errors, setErrors] = useState<Record<number, Partial<Record<keyof ExtractedData['items'][0], string>>>>({});



    const updateItem = (index: number, field: keyof ExtractedData['items'][0], value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const validate = () => {
        const newErrors: Record<number, Partial<Record<keyof ExtractedData['items'][0], string>>> = {};
        let isValid = true;
        items.forEach((item, index) => {
            const itemErrors: Partial<Record<keyof ExtractedData['items'][0], string>> = {};
            if (!item.productName.trim()) itemErrors.productName = 'Required';
            if (item.price <= 0) itemErrors.price = '> 0';
            if (item.quantity <= 0) itemErrors.quantity = '> 0';
            if (Object.keys(itemErrors).length > 0) { newErrors[index] = itemErrors; isValid = false; }
        });
        setErrors(newErrors);
        return isValid;
    };

    const handleSave = () => {
        if (validate()) {
            const records: SaleRecord[] = items.map(item => ({
                id: crypto.randomUUID(),
                ...item,
                category: item.category as Category,
                timestamp: Date.now(),
            }));
            onSave(records);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Review Products ({items.length})</h3>
                    <p className="text-xs text-slate-500 font-medium">Verify data extracted by Gemini AI</p>
                </div>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
                {items.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 italic">No products to save.</div>
                ) : items.map((item, index) => (
                    <div key={index} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50/30 group">
                        <button onClick={() => removeItem(index)} className="absolute -top-2 -right-2 p-1 bg-white border border-slate-200 text-slate-400 rounded-full hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                            <X size={14} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-6 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</label>
                                <input type="text" value={item.productName} onChange={(e) => updateItem(index, 'productName', e.target.value)} className="w-full text-sm font-semibold bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none pb-1" />
                                {errors[index]?.productName && <p className="text-[10px] text-red-500">{errors[index]?.productName}</p>}
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</label>
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-300 text-xs">$</span>
                                    <input type="number" step="0.01" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} className="w-full text-sm font-bold bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none pb-1" />
                                </div>
                                {errors[index]?.price && <p className="text-[10px] text-red-500">{errors[index]?.price}</p>}
                            </div>
                            <div className="md:col-span-1 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qty.</label>
                                <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} className="w-full text-sm font-bold bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none pb-1" />
                                {errors[index]?.quantity && <p className="text-[10px] text-red-500">{errors[index]?.quantity}</p>}
                            </div>
                            <div className="md:col-span-3 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                                <select value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)} className="w-full text-[11px] font-black uppercase text-blue-600 bg-transparent outline-none cursor-pointer">
                                    {Object.values(Category).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                <button onClick={handleSave} disabled={items.length === 0} className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50">
                    <Save size={18} /> Save All ({items.length})
                </button>
                <button onClick={onCancel} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-white transition-all">Cancel</button>
            </div>
        </div>
    );
}