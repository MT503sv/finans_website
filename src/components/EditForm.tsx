'use client';

import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { ExtractedData, Category, SaleRecord } from '@/types';
import { addSale } from '@/app/sales/actions/sales';

interface EditFormProps {
    data: ExtractedData;
    onSave: (records: SaleRecord[]) => void;
    onCancel: () => void;
}

export default function EditForm({ data, onSave, onCancel }: EditFormProps) {
    const [items, setItems] = useState<ExtractedData['items']>(data.items);
    const [errors, setErrors] = useState<Record<number, Partial<Record<keyof ExtractedData['items'][0], string>>>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);
        setError(null);

        try {
            const savedRecords: SaleRecord[] = [];

            for (const item of items) {
                await addSale({
                    product: item.productName,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    date: new Date().toISOString().split('T')[0],
                });

                const record: SaleRecord = {
                    id: crypto.randomUUID(),
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity,
                    category: item.category as Category,
                    timestamp: Date.now(),
                };
                savedRecords.push(record);
            }

            onSave(savedRecords);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving sales. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-6">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Review Products ({items.length})</h3>
                    <p className="text-xs text-slate-500 font-medium">Verify data extracted by Kuali AI</p>
                </div>
                <button onClick={onCancel} disabled={loading} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
                {items.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 italic">No products to save.</div>
                ) : items.map((item, index) => (
                    <div key={index} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50/30 group">
                        <button onClick={() => removeItem(index)} disabled={loading} className="absolute -top-2 -right-2 p-1 cursor-pointer bg-white border border-slate-200 text-slate-400 rounded-full hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50">
                            <X size={14} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-6 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Product</label>
                                <input type="text" value={item.productName} onChange={(e) => updateItem(index, 'productName', e.target.value)} disabled={loading} className="w-full text-sm font-semibold bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none pb-1 disabled:opacity-50" />
                                {errors[index]?.productName && <p className="text-[10px] text-red-500">{errors[index]?.productName}</p>}
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</label>
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-300 text-xs">$</span>
                                    <input type="number" step="0.01" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} disabled={loading} className="w-full text-sm font-bold bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none pb-1 disabled:opacity-50" />
                                </div>
                                {errors[index]?.price && <p className="text-[10px] text-red-500">{errors[index]?.price}</p>}
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qty.</label>
                                <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} disabled={loading} className="w-full text-sm font-bold bg-transparent border-b border-slate-200 focus:border-blue-400 outline-none pb-1 disabled:opacity-50" />
                                {errors[index]?.quantity && <p className="text-[10px] text-red-500">{errors[index]?.quantity}</p>}
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                                <p className="text-[11px] font-black uppercase text-[#010221] pb-1">{item.category}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <div className="mx-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                <button onClick={handleSave} disabled={items.length === 0 || loading} className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[#010221] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-[#010221]/90 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {loading ? 'Saving...' : `Save All (${items.length})`}
                </button>
                <button onClick={onCancel} disabled={loading} className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
            </div>
        </div>
    );
}