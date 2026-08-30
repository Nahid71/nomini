'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { CrowdfarmProject, InvestmentCertificate } from '@/types';
import { useAuthStore } from '@/lib/store/authStore';
import { ProjectManagementModal } from '@/components/investments/ProjectManagementModal';
import confetti from 'canvas-confetti';
import nominiEmblem from '@/assets/nomini-emblem.png';
import {
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  Layers,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Edit2,
  Trash2,
  Share2,
  Users,
  Building,
  Sprout,
  ShieldAlert,
} from 'lucide-react';

export default function CrowdfarmProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const { currentUser } = useAuthStore();
  const [project, setProject] = useState<any | null>(null);
  const [sharesToBook, setSharesToBook] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<InvestmentCertificate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCrowdfarmProject(projectId);
      setProject(data);
    } catch (err: any) {
      console.error('Failed to load project details:', err);
      setErrorMessage(err.message || 'Project not found or unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookShares = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    if (!currentUser || (currentUser.role !== 'INVESTOR' && currentUser.role !== 'ADMIN')) {
      setErrorMessage(
        `Role restricted: Current active role is '${currentUser?.role || 'GUEST'}'. Please sign in with an Investor or Admin account to purchase equity shares.`,
      );
      return;
    }

    setIsBooking(true);
    setErrorMessage(null);

    try {
      const res = await api.bookShares({
        projectId: project.id,
        sharesBooked: Number(sharesToBook),
        paymentMethod: 'WISE_TRANSFER',
      });

      if (res && res.certificate) {
        setBookingSuccess(res.certificate);
        loadProject();

        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error('Share booking failed:', err);
      setErrorMessage(err.message || 'Failed to book shares');
    } finally {
      setIsBooking(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    if (confirm(`Are you sure you want to permanently delete '${project.title}'?`)) {
      try {
        await api.deleteCrowdfarmProject(project.id);
        router.push('/investments');
      } catch (err: any) {
        alert(err.message || 'Failed to delete project');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title || 'Nomini Crowdfarming Offering',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading investment asset prospectus...</p>
      </div>
    );
  }

  if (errorMessage && !project) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-4">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-rose-800 text-sm font-semibold">
          {errorMessage}
        </div>
        <Link
          href="/investments"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Crowdfarming Offerings</span>
        </Link>
      </div>
    );
  }

  const raised = Number(project.raisedAmount);
  const target = Number(project.targetAmount);
  const percentRaised = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;
  const isFullyFunded = project.availableShares <= 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-500 font-medium truncate">
          <Link href="/investments" className="hover:text-forest-700 flex items-center gap-1 font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Crowdfarming</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">Co-Ownership Asset</span>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-[220px] sm:max-w-none">
            {project.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Link Copied!' : 'Share Prospectus'}</span>
          </button>

          {/* Admin Controls */}
          {currentUser?.role === 'ADMIN' && (
            <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Edit Project</span>
              </button>

              <button
                onClick={handleDeleteProject}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-all flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Share Booking Certificate Modal */}
      {bookingSuccess && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-forest-500 shadow-2xl space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-md flex items-center justify-center mx-auto mb-2">
              <Image
                src={nominiEmblem}
                alt="Nomini Group & Agro"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-forest-100 text-forest-800 border border-forest-200">
              Digital Farm Share Certificate Issued
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Certificate of Beneficial Farm Ownership
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Serial: {bookingSuccess.serialNumber} • NOMINI GROUP & AGRO.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Registered Holder</span>
              <strong className="text-slate-900">{bookingSuccess.investorName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Project Asset</span>
              <strong className="text-slate-900">{bookingSuccess.projectName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Equity Shares Booked</span>
              <strong className="text-forest-700 font-black text-sm">
                {bookingSuccess.sharesBooked} Shares
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Total Capital Paid</span>
              <strong className="text-slate-900 font-black text-sm">
                ${bookingSuccess.totalPaidUSD.toFixed(2)} USD
              </strong>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setBookingSuccess(null)}
              className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl min-h-[320px] flex flex-col justify-end p-6 sm:p-10">
        <img
          src={project.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200'}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              {project.expectedRoi || '20.5% Projected Annual ROI'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-forest-500/20 text-forest-300 border border-forest-400/30 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{project.location || 'Fulbari, Dinajpur'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {project.harvestCycle || 'Continuous Multi-Crop Cycles (Grains, High-Value Spices & Solar Fish Hatcheries)'}
          </p>
        </div>
      </div>

      {/* Key Economics & Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Metrics & Full Prospectus */}
        <div className="lg:col-span-7 space-y-6">
          {/* Funding Progress Meter */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
                  Capital Campaign Progress
                </span>
                <span className="text-2xl font-black text-forest-900 font-mono">
                  ${raised.toLocaleString()} USD
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {' '}raised of ${target.toLocaleString()} target
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  {percentRaised}% Funded
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 via-forest-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentRaised}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 pt-1 font-medium">
              <span>{project.totalShares - project.availableShares} Shares Booked</span>
              <span>{project.availableShares} Shares Remaining</span>
            </div>
          </div>

          {/* 6-Metric Investor Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Share Price</span>
              <strong className="text-base font-black text-slate-900 font-mono">
                ${Number(project.sharePrice).toFixed(2)} USD
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Shares</span>
              <strong className="text-base font-black text-slate-900 font-mono">
                {project.totalShares.toLocaleString()}
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Shares</span>
              <strong className="text-base font-black text-forest-700 font-mono">
                {project.availableShares.toLocaleString()}
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Dividend</span>
              <strong className="text-base font-black text-amber-600">
                {project.expectedRoi || '20.5% Annual'}
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Harvest Frequency</span>
              <strong className="text-xs font-bold text-slate-900">
                Quarterly / Annual
              </strong>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Asset Security</span>
              <strong className="text-xs font-bold text-slate-900">
                Farmland & Solar Grid
              </strong>
            </div>
          </div>

          {/* Detailed Project Scope & Narrative */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-forest-600" />
              Project Blueprint & Agronomy Engineering
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {project.description ||
                'Commercial 500-hectare precision agriculture, solar-powered biofloc aquaculture hatcheries, and renewable bio-energy grid in Fulbari, Dinajpur. Co-investors hold direct beneficial ownership interests backed by registered physical land titles and high-output agro assets. Returns are distributed annually in USD or BDT with audited statements certified by Chartered Accountants.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="p-3.5 rounded-2xl bg-forest-50/60 border border-forest-100 space-y-1">
                <span className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-forest-600" />
                  Closed-Loop Agro-Solar Design
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dual-use agro-voltaic panels providing shade for sensitive crops while generating 15 MW renewable electricity.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Digital Certificate Security
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Legally binding digital certificates registered with unique hash serial numbers and quarterly audit ledgers.
                </p>
              </div>
            </div>
          </div>

          {/* Verified Investors & Co-Owners */}
          {project.investments && project.investments.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-forest-600" />
                Recent Verified Co-Investors ({project.investments.length})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {project.investments.map((inv: any) => (
                  <div key={inv.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 font-black text-xs flex items-center justify-center">
                        {inv.user?.fullName?.charAt(0) || 'I'}
                      </div>
                      <div>
                        <strong className="text-slate-900 block">{inv.user?.fullName || 'Anonymous Investor'}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">Status: {inv.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-forest-700 font-mono font-black">{inv.sharesBooked} Shares</strong>
                      <span className="text-[10px] text-slate-400 block">${Number(inv.totalPaidUSD).toFixed(2)} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Share Booking Widget */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-forest-500 shadow-xl space-y-6 sticky top-24">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-forest-100 text-forest-800">
                Direct Beneficial Co-Ownership
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                Book Equity Shares
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Annual dividends, capital appreciation, and legally binding digital certificates.
              </p>
            </div>

            <form onSubmit={handleBookShares} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Shares to Book (Available: {project.availableShares})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={project.availableShares}
                    disabled={isFullyFunded}
                    value={sharesToBook}
                    onChange={(e) => setSharesToBook(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-base font-mono font-bold focus:ring-2 focus:ring-forest-500 outline-none disabled:opacity-50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Shares
                  </span>
                </div>
              </div>

              {/* Cost Calculation Summary */}
              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Price per Share:</span>
                  <span className="font-mono font-bold">${Number(project.sharePrice).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Projected Annual Return:</span>
                  <span className="font-bold text-amber-700">{project.expectedRoi || '20.5% ROI'}</span>
                </div>
                <div className="flex justify-between text-forest-950 text-sm font-black pt-2 border-t border-forest-200">
                  <span>Total Capital Required:</span>
                  <span className="font-mono font-black text-base text-forest-800">
                    ${(sharesToBook * Number(project.sharePrice)).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBooking || isFullyFunded}
                className="w-full py-3.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-black text-xs shadow-lg shadow-forest-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-102"
              >
                {isFullyFunded ? (
                  <span>Project Fully Subscribed</span>
                ) : isBooking ? (
                  <span>Issuing Digital Certificate...</span>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Confirm & Issue Share Certificate</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-[11px] text-slate-400 text-center space-y-1">
              <p>🔒 256-Bit SSL Encrypted • Wise & SWIFT Wire Transfers Accepted</p>
              <p>NOMINI GROUP & AGRO. • Registered in Bangladesh</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Project Edit Modal */}
      <ProjectManagementModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadProject}
        projectToEdit={project}
      />
    </div>
  );
}

