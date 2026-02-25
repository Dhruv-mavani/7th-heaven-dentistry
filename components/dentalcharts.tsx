"use client";
import React, { useState } from 'react';

const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
const upperLeft  = [21, 22, 23, 24, 25, 26, 27, 28];
const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
const lowerLeft  = [31, 32, 33, 34, 35, 36, 37, 38];

export default function DentalChart({ patientId }: { patientId: string }) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [teethData, setTeethData] = useState<Record<number, string>>({});

  const updateTooth = (tooth: number, condition: string) => {
    setTeethData(prev => ({ ...prev, [tooth]: condition }));
    setSelectedTooth(null);
    // TODO: Add Supabase push here
  };

  const getToothColor = (tooth: number) => {
    switch (teethData[tooth]) {
      case 'cavity': return 'bg-red-500 text-white';
      case 'filled': return 'bg-blue-500 text-white';
      case 'missing': return 'bg-slate-200 text-slate-400';
      default: return 'bg-white border-slate-300 text-slate-700';
    }
  };

  const Tooth = ({ num }: { num: number }) => (
    <div 
      onClick={() => setSelectedTooth(num)}
      className={`w-10 h-12 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-105 font-bold text-xs ${getToothColor(num)}`}
    >
      {num}
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
      <h3 className="text-lg font-bold mb-6 text-slate-800">Visual Dental Chart</h3>
      
      <div className="flex flex-col gap-8 items-center">
        {/* UPPER JAW */}
        <div className="flex gap-2">
          <div className="flex gap-1 border-r-2 border-slate-300 pr-2">{upperRight.map(n => <Tooth key={n} num={n}/>)}</div>
          <div className="flex gap-1 pl-2">{upperLeft.map(n => <Tooth key={n} num={n}/>)}</div>
        </div>

        {/* LOWER JAW */}
        <div className="flex gap-2">
          <div className="flex gap-1 border-r-2 border-slate-300 pr-2">{lowerRight.map(n => <Tooth key={n} num={n}/>)}</div>
          <div className="flex gap-1 pl-2">{lowerLeft.map(n => <Tooth key={n} num={n}/>)}</div>
        </div>
      </div>

      {/* CONDITION PICKER MODAL */}
      {selectedTooth && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-64">
            <h4 className="font-bold mb-4 text-center">Tooth #{selectedTooth}</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => updateTooth(selectedTooth, 'cavity')} className="p-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm">Cavity / Decay</button>
              <button onClick={() => updateTooth(selectedTooth, 'filled')} className="p-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">Filled</button>
              <button onClick={() => updateTooth(selectedTooth, 'missing')} className="p-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm">Missing</button>
              <button onClick={() => setSelectedTooth(null)} className="mt-2 p-2 text-slate-400 text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}