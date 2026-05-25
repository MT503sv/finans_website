'use client';

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExtractedData } from '@/types';

interface OCRScannerProps {
  onDataExtracted: (data: ExtractedData) => void;
}

export default function OCRScanner({ onDataExtracted }: OCRScannerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: base64 }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error processing the image.');
      }
      const data: ExtractedData = await res.json();
      onDataExtracted(data);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing the note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-[#C2C9FF] overflow-hidden">
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-500">
            <Camera size={40} color='#CBD5E1'/>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Upload Sales Receipt</h2>
            <p className="text-slate-500 mt-1 text-sm">Upload a clear photo to extract data.</p>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-10 cursor-pointer hover:bg-slate-50 hover:border-[#C2C9FF] transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={32} className="text-slate-300 hover:text-[#C2C9FF]" />
              <span className="text-slate-600 font-medium">Select File</span>
              <span className="text-slate-400 text-xs mt-1 italic">JPG or PNG (max 4MB)</span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <AnimatePresence mode="wait">
          {preview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative aspect-video bg-slate-900 border-t border-slate-100"
            >
              <Image src={preview} alt="Preview" layout="fill" objectFit="contain" />
              {loading && (
                <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white gap-3 backdrop-blur-sm">
                  <Loader2 className="animate-spin" size={48} />
                  <p className="font-medium text-sm">Reading with Kuali...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-4 bg-red-50 border-t border-red-100 flex items-start gap-3 text-red-700">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}