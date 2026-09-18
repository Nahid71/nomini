'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CrowdfarmProject } from '@/types';
import { FileUpload } from '@/components/common/FileUpload';
import {
  X,
  Plus,
  Edit2,
  TrendingUp,
  MapPin,
  DollarSign,
  Layers,
  Percent,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectToEdit?: CrowdfarmProject | null;
}

export const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | string>(800000);
  const [raisedAmount, setRaisedAmount] = useState<number | string>(0);
  const [sharePrice, setSharePrice] = useState<number | string>(50);
  const [totalShares, setTotalShares] = useState<number | string>(16000);
  const [availableShares, setAvailableShares] = useState<number | string>(16000);
  const [expectedRoi, setExpectedRoi] = useState('20.5% Annual Projected Dividend');
  const [harvestCycle, setHarvestCycle] = useState('Continuous Multi-Crop Cycles');
  const [imageUrl, setImageUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || '');
      setDescription(projectToEdit.description || '');
      setLocation(projectToEdit.location || '');
      setTargetAmount(Number(projectToEdit.targetAmount) || 0);
      setRaisedAmount(Number(projectToEdit.raisedAmount) || 0);
      setSharePrice(Number(projectToEdit.sharePrice) || 0);
      setTotalShares(projectToEdit.totalShares || 0);
      setAvailableShares(projectToEdit.availableShares || 0);
      setExpectedRoi(projectToEdit.expectedRoi || '');
      setHarvestCycle(projectToEdit.harvestCycle || '');
      setImageUrl(projectToEdit.imageUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setLocation('Fulbari, Dinajpur, Rangpur Division, Bangladesh');
      setTargetAmount(800000);
      setRaisedAmount(0);
      setSharePrice(50);
      setTotalShares(16000);
      setAvailableShares(16000);
      setExpectedRoi('20.5% Annual Projected Dividend');
      setHarvestCycle('Continuous Multi-Crop Cycles');
      setImageUrl('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80');
    }
    setError(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount || !sharePrice || !totalShares) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      targetAmount: Number(targetAmount),
      raisedAmount: Number(raisedAmount) || 0,
      sharePrice: Number(sharePrice),
      totalShares: Number(totalShares),
      availableShares: Number(availableShares),
      expectedRoi: expectedRoi.trim() || undefined,
      harvestCycle: harvestCycle.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    };

    try {
      if (projectToEdit) {
        await api.updateCrowdfarmProject(projectToEdit.id, payload);
      } else {
        await api.createCrowdfarmProject(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setError(err.message || 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-8 z-10 border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {projectToEdit ? 'Edit Crowdfarm Project' : 'Create New Crowdfarm Project'}
              </h3>
              <p className="text-xs text-slate-500">
                {projectToEdit
                  ? `Update configuration & metrics for ${projectToEdit.title}`
                  : 'Add a new asset-backed crowdfarming co-ownership offering'}
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

        {error && (
          <div className="my-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Nomini Fulbari Integrated Agro-Industrial Park ($800k)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location / Farm Hub
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Fulbari, Dinajpur, Bangladesh"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Funding Amount ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min={1}
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="800000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Share Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                min={0.01}
                value={sharePrice}
                onChange={(e) => setSharePrice(e.target.value)}
                placeholder="50.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Equity Shares *
              </label>
              <input
                type="number"
                required
                min={1}
                value={totalShares}
                onChange={(e) => setTotalShares(e.target.value)}
                placeholder="16000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Available Shares *
              </label>
              <input
                type="number"
                required
                min={0}
                value={availableShares}
                onChange={(e) => setAvailableShares(e.target.value)}
                placeholder="9500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expected Annual ROI (%)
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={expectedRoi}
                  onChange={(e) => setExpectedRoi(e.target.value)}
                  placeholder="e.g. 20.5% Annual Dividend + Land Equity"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Harvest / Payout Cycle
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={harvestCycle}
                  onChange={(e) => setHarvestCycle(e.target.value)}
                  placeholder="e.g. Continuous Multi-Crop Cycles"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <FileUpload
            label="Project Banner / Cover Image"
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            accept="image/*"
            helperText="Upload project cover image from your computer (saved permanently on server)"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Project Description & Scope
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Commercial 500-hectare precision agriculture and solar greenhouse complex in Fulbari, Dinajpur. Funds land preparation ($500k), modern farm machinery ($100k)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
            />
          </div>

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
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Saving Project...</span>
              ) : projectToEdit ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Update Crowdfarm Project</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish New Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

