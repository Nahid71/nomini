'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Batch } from '@/types';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { SustainabilityCard } from '@/components/dpp/SustainabilityCard';
import { TimelineView } from '@/components/dpp/TimelineView';
import { LabReportModal } from '@/components/dpp/LabReportModal';
import { QrShareModal } from '@/components/dpp/QrShareModal';
import { BatchManagementModal } from '@/components/dpp/BatchManagementModal';
import {
  QrCode,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  ShoppingBag,
  FileSpreadsheet,
  Share2,
  CheckCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function DigitalProductPassportPage() {
  const params = useParams();
  const router = useRouter();
  const batchNumberParam = params.batchNumber as string;

  const [batch, setBatch] = useState<Batch | null>(null);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);

  const { addItem } = useCartStore();
  const { isStaff, currentUser } = useAuthStore();

  useEffect(() => {
    loadBatchData();
    loadAllBatches();
  }, [batchNumberParam]);

  const loadBatchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getBatchPassport(batchNumberParam);
      if (res && res.data) {
        setBatch(res.data);
      } else {
        setError('Batch data not found');
      }
    } catch (err: any) {
      console.error('Failed to load DPP:', err);
      setError(err.message || 'Unable to retrieve passport for this batch');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllBatches = async () => {
    try {
      const batches = await api.getAllBatches();
      setAllBatches(batches);
    } catch {
      // ignore
    }
  };

  const handleDeleteBatch = async () => {
    if (!batch) return;
    if (confirm(`Are you sure you want to delete DPP batch '${batch.batchNumber}'?`)) {
      try {
        await api.deleteBatch(batch.batchNumber);
        const batches = await api.getAllBatches();
        if (batches.length > 0) {
          router.push(`/dpp/${batches[0].batchNumber}`);
        } else {
          router.push('/products');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete batch');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-forest-200 border-t-forest-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Verifying Digital Product Passport on Nomini Chain...</p>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Passport Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">{error || `No data exists for batch '${batchNumberParam}'`}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dpp/BATCH-NOM-2026-001"
            className="px-4 py-2 rounded-xl bg-forest-600 text-white text-xs font-bold hover:bg-forest-700"
          >
            View Demo Batch #001
          </Link>
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const formattedHarvestDate = new Date(batch.harvestDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Staff Management Action Bar */}
      {isStaff() && (
        <div className="bg-white rounded-2xl p-4 border border-forest-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center flex-shrink-0 font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Staff Passport Management ({currentUser?.role})
              </h3>
              <p className="text-[11px] text-slate-500">
                Create new harvest batches, update sustainability scorecards, and append milestone timeline steps.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setBatchToEdit(batch);
                setIsBatchModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-forest-600" />
              <span>Edit Passport & Milestones</span>
            </button>

            <button
              onClick={() => {
                setBatchToEdit(null);
                setIsBatchModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>

            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={handleDeleteBatch}
                className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 transition-all"
                title="Delete this batch"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Batch Switcher Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 flex-shrink-0">
          <QrCode className="w-4 h-4 text-forest-600" />
          <span>Switch Sample Passport:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto -mx-1 px-1">
          {allBatches.map((b) => {
            const isSelected = b.batchNumber === batch.batchNumber;
            return (
              <button
                key={b.id}
                onClick={() => router.push(`/dpp/${b.batchNumber}`)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-forest-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {b.batchNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Passport Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-forest-100 text-forest-800 border border-forest-200">
                <ShieldCheck className="w-4 h-4 text-forest-600" /> Verified DPP Passport
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                EU ESPR Standard Compliant
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-all sm:break-normal">
              Batch: <span className="font-mono text-forest-700">{batch.batchNumber}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Authentic farm origin traceability record detailing plot soil prep, harvest analytics, and real-time sustainability metrics.
            </p>
          </div>

          {/* Top Quick Actions: QR Modal & Lab Certificate */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <QrCode className="w-4 h-4 text-forest-600" />
              <span>Mobile QR</span>
            </button>

            <button
              onClick={() => setIsLabModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Lab Chemical Assay</span>
            </button>
          </div>
        </div>

        {/* Key Origin Coordinates & Harvest Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Farm Plot & Terraces</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{batch.farmPlot || 'Nomini Agroforestry Plot'}</p>
              {batch.geoCoordinates && (
                <span className="text-[11px] font-mono text-slate-500">{batch.geoCoordinates}</span>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Calendar className="w-5 h-5 text-forest-600 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Harvest Date</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{formattedHarvestDate}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Peak Sugar & Brix Verified</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <Layers className="w-5 h-5 text-indigo-500 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Traceability Hash</span>
              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5 truncate max-w-[180px]">
                0x7f9a...{batch.id.substring(0, 8)}
              </p>
              <span className="text-[11px] text-slate-500">Nomini Verified Chain</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Physical Product & Direct Add to Cart Banner */}
      {batch.product && (
        <div className="bg-gradient-to-r from-forest-50 to-emerald-50 rounded-3xl p-6 border border-forest-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={batch.product.imageUrl || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300'}
              alt={batch.product.title}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl shadow-md border-2 border-white flex-shrink-0"
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-700 bg-forest-200/70 px-2 py-0.5 rounded-md">
                Packaged Physical Harvest
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {batch.product.title}
              </h3>
              <div className="flex items-center space-x-3 mt-1 text-xs">
                <span className="text-base font-black text-forest-800">
                  ${Number(batch.product.priceUSD).toFixed(2)}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-600 font-semibold">
                  {batch.product.stockQty} in stock (Cold-Stored)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => {
                if (batch.product) {
                  addItem(batch.product, 1);
                }
              }}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-lg shadow-forest-600/20 transition-all flex items-center justify-center space-x-2 hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add This Batch to Cart</span>
            </button>
          </div>
        </div>
      )}

      {/* Sustainability Scorecard Matrix */}
      <SustainabilityCard sustainability={batch.sustainability} />

      {/* Farm-to-Fork Timeline */}
      {batch.timeline && batch.timeline.length > 0 && (
        <TimelineView timeline={batch.timeline} />
      )}

      {/* Modals */}
      <LabReportModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        batchNumber={batch.batchNumber}
        reportUrl={batch.labReportUrl}
      />

      <QrShareModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        batchNumber={batch.batchNumber}
      />

      {/* Batch Management Modal */}
      <BatchManagementModal
        isOpen={isBatchModalOpen}
        onClose={() => {
          setIsBatchModalOpen(false);
          setBatchToEdit(null);
        }}
        onSuccess={(newBatchNumber) => {
          loadAllBatches();
          if (newBatchNumber && newBatchNumber !== batch.batchNumber) {
            router.push(`/dpp/${newBatchNumber}`);
          } else {
            loadBatchData();
          }
        }}
        batchToEdit={batchToEdit}
      />
    </div>
  );
}
