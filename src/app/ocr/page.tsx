'use client';

import { useState } from 'react';
import OCRScanner from '@/components/OCRScanner';
import EditForm from '@/components/EditForm';
import SalesHistory from '@/components/SalesHistory';
import { SaleRecord, ExtractedData } from '@/types';

export default function OCRPage() {
  const [step, setStep] = useState<'idle' | 'editing'>('idle');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [records, setRecords] = useState<SaleRecord[]>([]);

  const handleDataExtracted = (data: ExtractedData) => {
    setExtractedData(data);
    setStep('editing');
  };

  const handleSaveRecords = (newRecords: SaleRecord[]) => {
    setRecords([...newRecords, ...records]);
    setStep('idle');
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-white py-5">
      <div className="mb-6 px-6 pt-3">
        <h1 className="text-2xl font-bold text-[#010221]">Kuali Scanner</h1>
      </div>
      {step === 'idle' ? (
        <>
          <OCRScanner onDataExtracted={handleDataExtracted} />
          <div className="max-w-4xl mx-auto px-4 mt-12">
            <SalesHistory records={records} onDelete={handleDeleteRecord} />
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <EditForm
            data={extractedData!}
            onSave={handleSaveRecords}
            onCancel={() => setStep('idle')}
          />
        </div>
      )}
    </div>
  );
}