'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  X,
  Plus,
  Trash2,
  PieChart,
  BarChart3,
  DollarSign,
  Layers,
  Percent,
  CheckCircle2,
  AlertCircle,
  Settings,
  Calculator,
} from 'lucide-react';

interface AllocationItem {
  area: string;
  desc: string;
  amount: number;
  percent: number;
}

interface ProjectionItem {
  year: string;
  sales: number;
  costs: number;
  profit: number;
  margin: string;
}

interface FinancialPlanManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPlan?: {
    title?: string;
    totalPoolUSD?: number;
    useOfFunds?: AllocationItem[];
    projections?: ProjectionItem[];
  };
}

export const FinancialPlanManagementModal: React.FC<FinancialPlanManagementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'ALLOCATIONS' | 'PROJECTIONS' | 'SETTINGS'>('ALLOCATIONS');

  const [title, setTitle] = useState('$800,000 Commercial Agriculture Project');
  const [totalPoolUSD, setTotalPoolUSD] = useState<number>(800000);
  const [useOfFunds, setUseOfFunds] = useState<AllocationItem[]>([]);
  const [projections, setProjections] = useState<ProjectionItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentPlan) {
      setTitle(currentPlan.title || '$800,000 Commercial Agriculture Project');
      setTotalPoolUSD(Number(currentPlan.totalPoolUSD) || 800000);
      setUseOfFunds(
        currentPlan.useOfFunds?.map((item) => ({
          ...item,
          amount: Number(item.amount),
          percent: Number(item.percent),
        })) || []
      );
      setProjections(
        currentPlan.projections?.map((proj) => ({
          ...proj,
          sales: Number(proj.sales),
          costs: Number(proj.costs),
          profit: Number(proj.profit),
        })) || []
      );
    }
  }, [currentPlan, isOpen]);

  if (!isOpen) return null;

  // Recalculate allocation percentage helper
  const handleAllocationChange = (index: number, field: keyof AllocationItem, value: any) => {
    const updated = [...useOfFunds];
    if (field === 'amount') {
      const numVal = Math.max(0, parseFloat(value) || 0);
      const calculatedPercent = totalPoolUSD > 0 ? Number(((numVal / totalPoolUSD) * 100).toFixed(2)) : 0;
      updated[index] = {
        ...updated[index],
        amount: numVal,
        percent: calculatedPercent,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setUseOfFunds(updated);
  };

  const addAllocationItem = () => {
    setUseOfFunds([
      ...useOfFunds,
      {
        area: 'New Investment Area',
        desc: 'Scope description...',
        amount: 25000,
        percent: totalPoolUSD > 0 ? Number(((25000 / totalPoolUSD) * 100).toFixed(2)) : 0,
      },
    ]);
  };

  const removeAllocationItem = (index: number) => {
    setUseOfFunds(useOfFunds.filter((_, i) => i !== index));
  };

  // Recalculate projection profit & margin helper
  const handleProjectionChange = (index: number, field: keyof ProjectionItem, value: any) => {
    const updated = [...projections];
    const item = { ...updated[index], [field]: value };

    const sales = field === 'sales' ? Math.max(0, parseFloat(value) || 0) : item.sales;
    const costs = field === 'costs' ? Math.max(0, parseFloat(value) || 0) : item.costs;
    const profit = sales - costs;
    const margin = sales > 0 ? `${((profit / sales) * 100).toFixed(1)}%` : '0.0%';

    updated[index] = {
      ...item,
      sales,
      costs,
      profit,
      margin,
    };
    setProjections(updated);
  };

  const addProjectionItem = () => {
    const nextYear = projections.length + 1;
    setProjections([
      ...projections,
      {
        year: `Year ${nextYear} (${2025 + nextYear})`,
        sales: 500000,
        costs: 200000,
        profit: 300000,
        margin: '60.0%',
      },
    ]);
  };

  const removeProjectionItem = (index: number) => {
    setProjections(projections.filter((_, i) => i !== index));
  };

  const totalAllocated = useOfFunds.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    const payload = {
      title,
      totalPoolUSD: Number(totalPoolUSD),
      useOfFunds,
      projections,
    };

    try {
      await api.updateFinancialPlan(payload);
      setSuccessMsg('Financial allocations and projections updated successfully!');
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Failed to update financial plan:', err);
      setError(err.message || 'Failed to update financial plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-5 sm:p-8 z-10 border border-slate-100 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center flex-shrink-0 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Financial Plan & Projections Editor
              </h3>
              <p className="text-xs text-slate-500">
                Admin control for Proposed Use of Funds allocations ($800k pool) and multi-year projection models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 p-1 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => setActiveTab('ALLOCATIONS')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'ALLOCATIONS'
                ? 'bg-white text-forest-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Use of Funds Allocations ({useOfFunds.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PROJECTIONS')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'PROJECTIONS'
                ? 'bg-white text-forest-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>3-Year Projections ({projections.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'SETTINGS'
                ? 'bg-white text-forest-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pool Settings</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: ALLOCATIONS */}
          {activeTab === 'ALLOCATIONS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 bg-forest-50 border border-forest-200 rounded-2xl text-xs">
                <div>
                  <span className="text-forest-700 font-bold">Total Capital Allocated: </span>
                  <strong className="text-slate-900 font-black text-sm font-mono">
                    ${totalAllocated.toLocaleString()} USD
                  </strong>
                  <span className="text-slate-500"> of ${Number(totalPoolUSD).toLocaleString()} Target</span>
                </div>
                <button
                  type="button"
                  onClick={addAllocationItem}
                  className="px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Allocation Line Item</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {useOfFunds.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:border-forest-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                        Item #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAllocationItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove allocation item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Investment Area
                        </label>
                        <input
                          type="text"
                          required
                          value={item.area}
                          onChange={(e) => handleAllocationChange(idx, 'area', e.target.value)}
                          placeholder="e.g. Land development & preparation"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Specific Scope Description
                        </label>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => handleAllocationChange(idx, 'desc', e.target.value)}
                          placeholder="e.g. 500-hectare site conditioning & boundary zoning"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 bg-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Amount ($ USD)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min={0}
                            value={item.amount}
                            onChange={(e) => handleAllocationChange(idx, 'amount', e.target.value)}
                            placeholder="500000"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-forest-500 bg-white"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-forest-700 bg-forest-50 px-1.5 py-0.5 rounded">
                            {item.percent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 3-YEAR PROJECTIONS */}
          {activeTab === 'PROJECTIONS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                <span className="text-slate-600 font-semibold">
                  Multi-Year Sales & Profit Financial Forecasting Model
                </span>
                <button
                  type="button"
                  onClick={addProjectionItem}
                  className="px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Forecast Year</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {projections.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 hover:border-forest-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                          Year #{idx + 1}
                        </span>
                        <span className="text-xs font-black text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded-full">
                          {proj.margin} Profit Margin
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProjectionItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove forecast year"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Year Label
                        </label>
                        <input
                          type="text"
                          required
                          value={proj.year}
                          onChange={(e) => handleProjectionChange(idx, 'year', e.target.value)}
                          placeholder="e.g. Year 1 (2026)"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-forest-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Expected Sales ($)
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={proj.sales}
                          onChange={(e) => handleProjectionChange(idx, 'sales', e.target.value)}
                          placeholder="200000"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-forest-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Operating Costs ($)
                        </label>
                        <input
                          type="number"
                          required
                          min={0}
                          value={proj.costs}
                          onChange={(e) => handleProjectionChange(idx, 'costs', e.target.value)}
                          placeholder="100000"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-forest-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                          Net Profit (Computed)
                        </label>
                        <div className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-mono font-black text-emerald-900">
                          ${(proj.sales - proj.costs).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Financial Plan Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. $800,000 Commercial Agriculture Project"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Investment Pool ($ USD)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={totalPoolUSD}
                  onChange={(e) => setTotalPoolUSD(Math.max(1, parseFloat(e.target.value) || 0))}
                  placeholder="800000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-white focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Updating Financial Model...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Allocations & Projections</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

