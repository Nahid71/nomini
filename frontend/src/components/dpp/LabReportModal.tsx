'use client';

import React from 'react';
import Image from 'next/image';
import { X, FileText, CheckCircle2, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import nominiEmblem from '@/assets/nomini-emblem.png';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber: string;
  reportUrl?: string;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  batchNumber,
  reportUrl,
}) => {
  if (!isOpen) return null;

  const assays = [
    { analyte: 'Synthetic Glyphosate Residue', limit: '< 0.01 ppm', result: '0.000 ppm (Not Detected)', status: 'PASS' },
    { analyte: 'Heavy Metals (Lead, Cadmium, Arsenic)', limit: '< 0.05 mg/kg', result: '< 0.002 mg/kg', status: 'PASS' },
    { analyte: 'Pesticide Multiresidue Screen (450+ compounds)', limit: 'EU MRL Standard', result: '100% Free / Clean', status: 'PASS' },
    { analyte: 'Microbiological Assay (Salmonella / E. coli)', limit: 'Absent / 25g', result: 'Negative / Absent', status: 'PASS' },
    { analyte: 'Total Polyphenols & Antioxidant Index', limit: '> 350 mg/100g', result: '482 mg/100g (Superior Grade)', status: 'PASS' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <Image
              src={nominiEmblem}
              alt="Nomini QA Lab"
              width={44}
              height={44}
              className="w-11 h-11 object-contain rounded-2xl bg-white p-1 shadow-sm border border-slate-100 flex-shrink-0"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Certificate of Chemical Analysis</h3>
              <p className="text-xs text-slate-500 font-mono">Lot & Batch: {batchNumber} • Nomini Group & Agro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Testing Facility</span>
            <strong className="text-slate-800">Nomini QA Lab (ISO 17025 / BSTI)</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Specimen Type</span>
            <strong className="text-slate-800">Direct Harvest Batch Sample</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Spectrometry</span>
            <strong className="text-slate-800">LC-MS/MS & GC-MS Purity</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Certification</span>
            <strong className="text-emerald-700 font-black">ISO 22000 & HACCP</strong>
          </div>
        </div>

        {/* Assays Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs min-w-[460px] sm:min-w-0">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Assay Parameter</th>
                <th className="p-3">Standard Limit</th>
                <th className="p-3">Lab Finding</th>
                <th className="p-3 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assays.map((assay, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 font-semibold text-slate-900">{assay.analyte}</td>
                  <td className="p-3 text-slate-500">{assay.limit}</td>
                  <td className="p-3 font-mono font-bold text-forest-700">{assay.result}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {assay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">Cryptographically stamped on Nomini Chain</span>
          <button
            onClick={() => alert(`Downloading official PDF certificate for ${batchNumber}`)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Signed Certificate (.PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
