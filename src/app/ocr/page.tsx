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

  return (
    <div className="min-h-screen bg-white py-5">
      <div className="mt-1 mb-5">
        <h1 className="text-4xl font-semibold mx-5">Scanner</h1>
      </div>
      {step === 'idle' ? (
        <>
          <OCRScanner onDataExtracted={(data) => { setExtractedData(data); setStep('editing'); }} />
          <div className="max-w-4xl mx-auto px-4 mt-12">
            <SalesHistory records={records} onDelete={(id) => setRecords(records.filter(r => r.id !== id))} />
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <EditForm
            data={extractedData!}
            onSave={(newRecords) => { setRecords([...newRecords, ...records]); setStep('idle'); }}
            onCancel={() => setStep('idle')}
          />
        </div>
      )}
    </div>
  );
}