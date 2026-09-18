'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Batch } from '@/types';
import { FileUpload } from '@/components/common/FileUpload';
import { X, QrCode, Plus, Calendar, MapPin, ShieldCheck, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface BatchManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBatchNumber?: string) => void;
  batchToEdit?: Batch | null;
}

export const BatchManagementModal: React.FC<BatchManagementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  batchToEdit,
}) => {
  const isEditing = !!batchToEdit;

  const [batchNumber, setBatchNumber] = useState('');
  const [farmPlot, setFarmPlot] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [geoCoordinates, setGeoCoordinates] = useState('');
  const [labReportUrl, setLabReportUrl] = useState('');

  // Sustainability fields
  const [carbonRating, setCarbonRating] = useState('A+');
  const [netEmissionsKg, setNetEmissionsKg] = useState('-2.10 kg CO2e / kg');
  const [waterConservation, setWaterConservation] = useState('98.6% via Solar Drip');
  const [organicCertified, setOrganicCertified] = useState(true);
  const [certificationBody, setCertificationBody] = useState('ISO 22000, HACCP & Halal Certified');
  const [pesticideFree, setPesticideFree] = useState('100% Zero Synthetic Pesticides');
  const [soilHealthIndex, setSoilHealthIndex] = useState(97);

  // New Timeline Step
  const [includeNewStep, setIncludeNewStep] = useState(false);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDate, setStepDate] = useState('');
  const [stepDesc, setStepDesc] = useState('');
  const [stepOperator, setStepOperator] = useState('Nomini QA Lead');
  const [stepLocation, setStepLocation] = useState('Fulbari Agro Zone');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (batchToEdit) {
        setBatchNumber(batchToEdit.batchNumber);
        setFarmPlot(batchToEdit.farmPlot || '');
        setHarvestDate(
          batchToEdit.harvestDate ? new Date(batchToEdit.harvestDate).toISOString().split('T')[0] : ''
        );
        setGeoCoordinates(batchToEdit.geoCoordinates || '');
        setLabReportUrl(batchToEdit.labReportUrl || '');

        const s = batchToEdit.sustainability || {};
        setCarbonRating(s.carbonRating || 'A+');
        setNetEmissionsKg(s.netEmissionsKg || '-2.10 kg CO2e / kg');
        setWaterConservation(s.waterConservation || '98.6% via Solar Drip');
        setOrganicCertified(s.organicCertified !== false);
        setCertificationBody(s.certificationBody || 'ISO 22000, HACCP & Halal Certified');
        setPesticideFree(s.pesticideFree || '100% Zero Synthetic Pesticides');
        setSoilHealthIndex(s.soilHealthIndex || 97);
      } else {
        const nextNum = `BATCH-NOM-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
        setBatchNumber(nextNum);
        setFarmPlot('Plot Alpha-2 (Fulbari Agro Zone, Dinajpur)');
        setHarvestDate(new Date().toISOString().split('T')[0]);
        setGeoCoordinates('25.4988° N, 88.8892° E');
        setLabReportUrl(`https://nominigroup.com/reports/${nextNum}-LAB.pdf`);
        setCarbonRating('A+');
        setNetEmissionsKg('-2.10 kg CO2e / kg (Carbon Negative)');
        setWaterConservation('98.6% via Solar Drip Irrigation');
        setOrganicCertified(true);
        setCertificationBody('ISO 22000, HACCP, Ecocert & BSTI Certified');
        setPesticideFree('100% Zero Synthetic Pesticides');
        setSoilHealthIndex(97);
      }
      setIncludeNewStep(false);
      setStepTitle('');
      setStepDate(new Date().toISOString().split('T')[0]);
      setStepDesc('');
      setStepOperator('Md. Rubel Hossain (Operations In-Charge)');
      setStepLocation('Fulbari Agro Zone, Dinajpur');
      setError(null);
    }
  }, [isOpen, batchToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNumber.trim()) {
      setError('Batch Number is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const sustainabilityPayload = {
      carbonRating,
      netEmissionsKg,
      waterConservation,
      organicCertified,
      certificationBody,
      pesticideFree,
      soilHealthIndex: Number(soilHealthIndex),
    };

    const payload = {
      batchNumber: batchNumber.trim(),
      farmPlot: farmPlot.trim() || undefined,
      harvestDate: new Date(harvestDate).toISOString(),
      geoCoordinates: geoCoordinates.trim() || undefined,
      labReportUrl: labReportUrl.trim() || undefined,
      sustainability: sustainabilityPayload,
    };

    try {
      if (isEditing && batchToEdit) {
        await api.updateBatch(batchToEdit.batchNumber, payload);

        // If user added a new timeline step
        if (includeNewStep && stepTitle.trim()) {
          await api.addTimelineStep(batchToEdit.batchNumber, {
            date: stepDate || new Date().toISOString().split('T')[0],
            title: stepTitle.trim(),
            description: stepDesc.trim(),
            operator: stepOperator.trim(),
            location: stepLocation.trim(),
            status: 'COMPLETED',
          });
        }
      } else {
        const initialTimeline = [
          {
            step: 1,
            date: harvestDate,
            title: 'Farm Soil Conditioning & Planting',
            description: 'Organic compost applied from Nomini 15 MW bio-energy division in Fulbari.',
            operator: 'Nomini Agronomy Team',
            location: farmPlot || 'Fulbari Agro Zone',
            status: 'COMPLETED',
          },
          {
            step: 2,
            date: harvestDate,
            title: 'Harvest & Verification Completed',
            description: 'Harvested under certified ISO 22000 organic protocols.',
            operator: 'Nomini Operations Lead',
            location: farmPlot || 'Fulbari Agro Zone',
            status: 'COMPLETED',
          },
        ];

        await api.createBatch({
          ...payload,
          timeline: initialTimeline,
        });
      }

      onSuccess(batchNumber.trim());
      onClose();
    } catch (err: any) {
      console.error('Failed to save DPP batch:', err);
      setError(err.message || 'Failed to save batch details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center flex-shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? `Edit DPP Passport (${batchToEdit?.batchNumber})` : 'Create New DPP Harvest Batch'}
              </h3>
              <p className="text-xs text-slate-500">
                EU ESPR compliant provenance, spectrometry assay links, and timeline milestones
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
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Core Batch Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Batch Identifier *
              </label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. BATCH-NOM-2026-005"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Harvest Date *
              </label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Farm Plot & Location
              </label>
              <input
                type="text"
                value={farmPlot}
                onChange={(e) => setFarmPlot(e.target.value)}
                placeholder="Plot Alpha-1 (Fulbari Agro Zone, Dinajpur)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GPS Coordinates
              </label>
              <input
                type="text"
                value={geoCoordinates}
                onChange={(e) => setGeoCoordinates(e.target.value)}
                placeholder="25.4988° N, 88.8892° E"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          <FileUpload
            label="Lab Assay Report / Analysis Document"
            value={labReportUrl}
            onChange={(url) => setLabReportUrl(url)}
            accept="image/*,application/pdf"
            helperText="Upload official chemical assay PDF or laboratory report certificate from your computer"
          />

          {/* Sustainability Scorecard Box */}
          <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 space-y-3">
            <h4 className="text-xs font-black text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
              Sustainability Matrix (EU ESPR Metrics)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Carbon Rating
                </label>
                <select
                  value={carbonRating}
                  onChange={(e) => setCarbonRating(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                >
                  <option value="A+">A+ (Net Carbon Sink)</option>
                  <option value="A">A (Ultra-Low Carbon)</option>
                  <option value="B">B (Eco-Standard)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Net Emissions
                </label>
                <input
                  type="text"
                  value={netEmissionsKg}
                  onChange={(e) => setNetEmissionsKg(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  Soil Health (0–100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={soilHealthIndex}
                  onChange={(e) => setSoilHealthIndex(parseInt(e.target.value, 10) || 90)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* Append New Timeline Step Option for Existing Batch */}
          {isEditing && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNewStep}
                    onChange={(e) => setIncludeNewStep(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500"
                  />
                  <span>Append New Supply Chain Milestone / Step</span>
                </label>
              </div>

              {includeNewStep && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Milestone Title *
                      </label>
                      <input
                        type="text"
                        value={stepTitle}
                        onChange={(e) => setStepTitle(e.target.value)}
                        placeholder="e.g. Spectrometry Assay Clearance"
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Milestone Date
                      </label>
                      <input
                        type="date"
                        value={stepDate}
                        onChange={(e) => setStepDate(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={stepDesc}
                      onChange={(e) => setStepDesc(e.target.value)}
                      placeholder="Verified 0.00 ppm chemical residues..."
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              )}
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Passport...' : isEditing ? 'Update DPP Passport' : 'Create DPP Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

