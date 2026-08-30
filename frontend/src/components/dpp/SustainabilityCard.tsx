'use client';

import React from 'react';
import { SustainabilityMetrics } from '@/types';
import {
  Leaf,
  Droplets,
  Sun,
  ShieldCheck,
  Award,
  Sparkles,
  TreePine,
  CheckCircle2,
} from 'lucide-react';

interface SustainabilityCardProps {
  sustainability: SustainabilityMetrics;
}

export const SustainabilityCard: React.FC<SustainabilityCardProps> = ({ sustainability }) => {
  return (
    <div className="bg-gradient-to-br from-forest-950 via-slate-900 to-forest-900 rounded-3xl p-6 text-white shadow-xl border border-forest-800/40 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-forest-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-forest-800/60">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-forest-500/20 text-forest-300 border border-forest-400/30">
              Verified ESG Matrix
            </span>
            <span className="text-xs text-slate-400">EU DPP Standard v2.4</span>
          </div>
          <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            Sustainability & Ecological Scorecard
          </h3>
        </div>

        {/* Big Carbon Rating Badge */}
        {sustainability.carbonRating && (
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-forest-300 block">Carbon Rating</span>
              <span className="text-xs text-slate-300 font-medium">Lifecycle Audit</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-forest-500 text-forest-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-forest-500/30">
              {sustainability.carbonRating}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Key Sustainability Metrics */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Net Emissions */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-forest-500/20 text-forest-300">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">Net Carbon Emissions</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {sustainability.netEmissionsKg || '-1.85 kg CO2e/kg'}
            </div>
            <p className="text-[11px] text-forest-300 mt-1">100% Carbon-Neutral / Negative</p>
          </div>
        </div>

        {/* Water Efficiency */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">Water Conservation</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {sustainability.waterConservation || '98% Closed Loop'}
            </div>
            <p className="text-[11px] text-sky-300 mt-1">Smart Deficit Drip Irrigation</p>
          </div>
        </div>

        {/* Organic Certification */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">Organic Certification</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {sustainability.certificationBody || 'Ecocert & USDA Bio'}
            </div>
            <p className="text-[11px] text-amber-300 mt-1">Zero Synthetic Chemicals</p>
          </div>
        </div>

        {/* Pesticide Free */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">Pesticide & Residue</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {sustainability.pesticideFree || '100% Zero Synthetic Pesticides'}
            </div>
            <p className="text-[11px] text-emerald-300 mt-1">Botanical Neem & Bio-Defenders</p>
          </div>
        </div>

        {/* Soil Health Index */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-300">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">Soil Health & Microbiome</div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-sm font-bold text-white">
                {sustainability.soilHealthIndex || 96} / 100
              </span>
              <div className="flex-1 w-20 bg-white/20 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-forest-400 h-full rounded-full"
                  style={{ width: `${sustainability.soilHealthIndex || 96}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-orange-300 mt-1">Regenerative Biochar Infused</p>
          </div>
        </div>

        {/* Solar Energy */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-300">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">Renewable Energy</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {sustainability.solarPoweredProcessing || '100% Clean Solar Power'}
            </div>
            <p className="text-[11px] text-yellow-300 mt-1">Zero Fossil Processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};
