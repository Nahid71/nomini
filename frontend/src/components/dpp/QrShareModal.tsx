'use client';

import React from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Copy, Check, Download } from 'lucide-react';
import nominiEmblem from '@/assets/nomini-emblem.png';

interface QrShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchNumber: string;
}

export const QrShareModal: React.FC<QrShareModalProps> = ({
  isOpen,
  onClose,
  batchNumber,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const passportUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dpp/${batchNumber}`
    : `https://nomini.group/dpp/${batchNumber}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10 border border-slate-100 text-center animate-in fade-in zoom-in-95">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center mx-auto mb-3">
          <Image
            src={nominiEmblem}
            alt="Nomini Group & Agro"
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>

        <h3 className="text-lg font-black text-slate-900">Physical QR Passport</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Scan with your smartphone camera to verify this harvest batch in real-time on Nomini Verified Chain.
        </p>

        {/* QR Canvas */}
        <div className="my-6 p-4 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block">
          <QRCodeSVG
            value={passportUrl}
            size={180}
            level="H"
            includeMargin={true}
          />
          <div className="text-[10px] font-mono font-bold text-slate-400 mt-2">
            {batchNumber}
          </div>
        </div>

        {/* Copy Link */}
        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <input
            type="text"
            readOnly
            value={passportUrl}
            className="bg-transparent flex-1 text-slate-600 text-[11px] outline-none font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-forest-600 text-white font-bold text-xs hover:bg-forest-700 transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
