'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { CrowdfarmProject, InvestmentCertificate } from '@/types';
import { useAuthStore } from '@/lib/store/authStore';
import { ProjectManagementModal } from '@/components/investments/ProjectManagementModal';
import { FinancialPlanManagementModal } from '@/components/investments/FinancialPlanManagementModal';
import confetti from 'canvas-confetti';
import nominiEmblem from '@/assets/nomini-emblem.png';
import {
  TrendingUp,
  Sprout,
  ShieldCheck,
  Award,
  CheckCircle2,
  DollarSign,
  FileText,
  AlertCircle,
  Percent,
  Lock,
  Layers,
  PieChart,
  BarChart3,
  ShieldAlert,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Calculator,
  Building,
} from 'lucide-react';

const DEFAULT_USE_OF_FUNDS = [
  { area: 'Land development & preparation', amount: 500000, percent: 62.65, desc: '500-hectare site conditioning & boundary zoning in Fulbari' },
  { area: 'Farm machinery & equipment', amount: 100000, percent: 12.50, desc: 'Modern tillers, decorticators, solar pumps & automated harvesters' },
  { area: 'Seeds, seedlings & planting materials', amount: 50000, percent: 6.25, desc: 'High-yield certified grains, cardamom & spice cultivars' },
  { area: 'Working capital & contingency reserve', amount: 50000, percent: 6.25, desc: 'Operational liquidity buffer and seasonal risk reserve' },
  { area: 'Fertilizer & crop protection', amount: 30000, percent: 3.75, desc: 'Organic bio-fertilizer digestate & bio-pest control' },
  { area: 'Labor & staff costs', amount: 20000, percent: 2.50, desc: 'Skilled agricultural technicians and agronomy supervisors' },
  { area: 'Storage, processing & packaging', amount: 20000, percent: 2.50, desc: 'Solar dehydration facilities and hermetic grain silos' },
  { area: 'Transportation & market development', amount: 15000, percent: 1.86, desc: 'Cold-chain distribution vehicles and off-taker channels' },
  { area: 'Irrigation & water infrastructure', amount: 10000, percent: 1.25, desc: 'Sub-surface solar drip lines & rainwater catchment' },
  { area: 'Administration & training', amount: 5000, percent: 0.62, desc: 'Farmer capacity building & ISO certification compliance' },
];

const DEFAULT_PROJECTIONS = [
  { year: 'Year 1 (2026)', sales: 200000, costs: 100000, profit: 100000, margin: '50.0%' },
  { year: 'Year 2 (2027)', sales: 350000, costs: 150000, profit: 200000, margin: '57.1%' },
  { year: 'Year 3 (2028)', sales: 600000, costs: 200000, profit: 400000, margin: '66.7%' },
];

export default function InvestmentsPage() {
  const { currentUser } = useAuthStore();
  const [projects, setProjects] = useState<CrowdfarmProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<CrowdfarmProject | null>(null);
  const [sharesToBook, setSharesToBook] = useState<number>(10);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<InvestmentCertificate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Admin Modals State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<CrowdfarmProject | null>(null);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);

  // Financial Plan Dynamic Data
  const [financialPlan, setFinancialPlan] = useState<any>({
    title: '$800,000 Commercial Agriculture Project',
    totalPoolUSD: 800000,
    useOfFunds: DEFAULT_USE_OF_FUNDS,
    projections: DEFAULT_PROJECTIONS,
  });

  useEffect(() => {
    loadProjects();
    loadFinancialPlan();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCrowdfarmProjects();
      setProjects(data);
    } catch (err: any) {
      console.error('Failed to load crowdfarm projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFinancialPlan = async () => {
    try {
      const data = await api.getFinancialPlan();
      if (data) {
        setFinancialPlan({
          title: data.title || '$800,000 Commercial Agriculture Project',
          totalPoolUSD: Number(data.totalPoolUSD) || 800000,
          useOfFunds: data.useOfFunds || DEFAULT_USE_OF_FUNDS,
          projections: data.projections || DEFAULT_PROJECTIONS,
        });
      }
    } catch (err: any) {
      console.warn('Using default financial plan:', err);
    }
  };

  const handleDeleteProject = async (project: CrowdfarmProject) => {
    if (confirm(`Are you sure you want to permanently delete '${project.title}'?`)) {
      try {
        await api.deleteCrowdfarmProject(project.id);
        loadProjects();
      } catch (err: any) {
        alert(err.message || 'Failed to delete project');
      }
    }
  };

  const handleBookShares = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

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
        projectId: selectedProject.id,
        sharesBooked: Number(sharesToBook),
        paymentMethod: 'WISE_TRANSFER',
      });

      if (res && res.certificate) {
        setBookingSuccess(res.certificate);
        loadProjects(); // Refresh available shares

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

  const useOfFundsList = financialPlan.useOfFunds || DEFAULT_USE_OF_FUNDS;
  const projectionsList = financialPlan.projections || DEFAULT_PROJECTIONS;
  const totalAllocatedUSD = useOfFundsList.reduce(
    (acc: number, item: any) => acc + (Number(item.amount) || 0),
    0
  );

  const cumulativeSales = projectionsList.reduce(
    (acc: number, item: any) => acc + (Number(item.sales) || 0),
    0
  );
  const cumulativeProfit = projectionsList.reduce(
    (acc: number, item: any) => acc + (Number(item.profit) || 0),
    0
  );

  return (
    <div className="space-y-10 sm:space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-forest-950 rounded-3xl p-6 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Nomini Group Crowdfarming Model
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 hidden sm:inline">
              High-Yield South Asia Agribusiness
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Co-Own High-Growth Agro-Industrial Assets in Bangladesh
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Participate directly in our commercial ${Number(financialPlan.totalPoolUSD).toLocaleString()} precision agriculture expansion, biofloc hatcheries, and 15 MW solar bio-energy grid in Fulbari, Dinajpur. Receive annual dividends with legally binding digital share certificates.
          </p>
        </div>
      </div>

      {/* Admin Management Action Bar (Admin only) */}
      {currentUser?.role === 'ADMIN' && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Crowdfarm & Financial Plan Controls (Admin: {currentUser?.fullName})
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-900">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                You have privileges to add, edit, or delete Co-Ownership projects, fund allocations, and 3-year projection models.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => {
                setProjectToEdit(null);
                setIsProjectModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>

            <button
              onClick={() => setIsFinancialModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 hover:scale-105"
            >
              <Calculator className="w-4 h-4" />
              <span>Manage Allocations & Projections</span>
            </button>
          </div>
        </div>
      )}

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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Certificate of Beneficial Farm Ownership</h2>
            <p className="text-xs text-slate-500 font-mono">Serial: {bookingSuccess.serialNumber} • NOMINI GROUP & AGRO.</p>
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
              <strong className="text-forest-700 font-black text-sm">{bookingSuccess.sharesBooked} Shares</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Total Capital Paid</span>
              <strong className="text-slate-900 font-black text-sm">${bookingSuccess.totalPaidUSD.toFixed(2)} USD</strong>
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

      {/* Active Crowdfarming Projects */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md">
              Current Offerings
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Active Crowdfarm Co-Ownership Projects
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading investment opportunities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const raised = Number(project.raisedAmount);
              const target = Number(project.targetAmount);
              const percentRaised = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <Link href={`/investments/${project.id}`}>
                      <img
                        src={project.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-forest-800 border border-forest-200 shadow-sm">
                        {project.location || 'Fulbari, Dinajpur'}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500 text-amber-950 shadow-md">
                        {project.expectedRoi || '20.5% Annual ROI'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Link href={`/investments/${project.id}`} className="block">
                        <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-amber-800 transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-forest-700 font-extrabold">${raised.toLocaleString()} Raised</span>
                        <span className="text-slate-500">${target.toLocaleString()} Target ({percentRaised}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-forest-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentRaised}%` }}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Share Price</span>
                        <strong className="text-slate-900 font-black">${Number(project.sharePrice).toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Available</span>
                        <strong className="text-slate-900 font-black">{project.availableShares} Shares</strong>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Link
                          href={`/investments/${project.id}`}
                          className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all flex items-center justify-center space-x-1"
                        >
                          <span>View Prospectus</span>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setBookingSuccess(null);
                          }}
                          className="py-2.5 px-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1 hover:scale-102"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Book Shares</span>
                        </button>
                      </div>

                      {/* Admin Edit & Delete Actions */}
                      {currentUser?.role === 'ADMIN' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setProjectToEdit(project);
                              setIsProjectModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProject(project)}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-all flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* High-Level Financial Plan from PDF */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-forest-100 text-forest-800">
                Official Financial Plan
              </span>
              <span className="text-xs text-slate-400">{financialPlan.title}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
              Proposed Allocation & 3-Year Projections
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-forest-50 border border-forest-200 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] uppercase font-bold text-forest-700 block">Total Investment Pool</span>
              <span className="text-lg sm:text-xl font-black text-forest-900">
                ${Number(financialPlan.totalPoolUSD).toLocaleString()} USD
              </span>
            </div>
            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => setIsFinancialModalOpen(true)}
                className="p-2.5 rounded-xl border border-forest-300 bg-white hover:bg-forest-50 text-forest-800 transition-colors shadow-xs"
                title="Edit Allocations & Projections"
              >
                <Edit2 className="w-4 h-4 text-forest-700" />
              </button>
            )}
          </div>
        </div>

        {/* Use of Funds Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-forest-600" />
              1. Proposed Use of Funds (${Number(financialPlan.totalPoolUSD).toLocaleString()} Allocation)
            </h3>
            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => setIsFinancialModalOpen(true)}
                className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Allocations</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Investment Area</th>
                  <th className="p-3">Specific Scope</th>
                  <th className="p-3">Amount (USD)</th>
                  <th className="p-3 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {useOfFundsList.map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{item.area}</td>
                    <td className="p-3 text-slate-500">{item.desc}</td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      ${Number(item.amount).toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold text-forest-700">{item.percent}%</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-black text-slate-900 border-t border-slate-200">
                  <td className="p-3" colSpan={2}>Total Capital Requirement</td>
                  <td className="p-3 font-mono text-forest-900 text-sm">
                    ${totalAllocatedUSD.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-forest-900">
                    {financialPlan.totalPoolUSD > 0
                      ? `${((totalAllocatedUSD / financialPlan.totalPoolUSD) * 100).toFixed(1)}%`
                      : '100%'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-Year Financial Projections Table */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-forest-600" />
              2. Three-Year Sales, Operating Costs & Profit Projections
            </h3>
            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => setIsFinancialModalOpen(true)}
                className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Projections</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projectionsList.map((proj: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{proj.year}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {proj.margin} Margin
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Expected Sales:</span>
                    <strong className="text-slate-900">${Number(proj.sales).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Operating Costs:</span>
                    <span>${Number(proj.costs).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-forest-900 font-bold pt-1.5 border-t border-slate-200 text-sm">
                    <span>Estimated Profit:</span>
                    <span className="text-forest-700 font-black">
                      ${Number(proj.profit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-900 gap-2">
            <span>
              <strong>Multi-Year Cumulative Projections:</strong> Total Sales of{' '}
              <strong>${cumulativeSales.toLocaleString()}</strong> generating{' '}
              <strong>${cumulativeProfit.toLocaleString()}</strong> in Net Operating Profit.
            </span>
            <span className="font-bold text-forest-800 text-sm mt-1 sm:mt-0 whitespace-nowrap">
              ROI Driven Model
            </span>
          </div>
        </div>

        {/* Risk & Reward Management from PDF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Risk Mitigation Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>• <strong>Climate & Extreme Weather:</strong> Climate-resilient seeds, automated drainage, and solar drip irrigation.</li>
              <li>• <strong>Pests & Crop Diseases:</strong> Integrated Bio-Pest Management and continuous LoRaWAN IoT telemetry.</li>
              <li>• <strong>Market Volatility:</strong> Advance buyer contracts and cold-chain storage to avoid harvest price dips.</li>
              <li>• <strong>Financial Protection:</strong> Phased capital injection with a dedicated $50,000 emergency reserve.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-forest-600" />
              Socio-Economic & Investor Rewards
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>• <strong>Direct Farmer Empowerment:</strong> Over 10,000 contract farming households receiving guaranteed buybacks.</li>
              <li>• <strong>National Food Security:</strong> Reliable domestic supply of pure organic grains, fish, dairy, and spices.</li>
              <li>• <strong>High-Value Exports:</strong> EU & US FDA export processing unlocking premium foreign exchange margins.</li>
              <li>• <strong>Asset-Backed Equity:</strong> Capital invested into tangible farmland, solar arrays, and high-tech biofloc tanks.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {selectedProject && !bookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">
              Book Shares: {selectedProject.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Secured share purchase with digital certificate generation (POST /api/v1/investments/book)
            </p>

            <form onSubmit={handleBookShares} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Shares (Available: {selectedProject.availableShares})
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedProject.availableShares}
                  value={sharesToBook}
                  onChange={(e) => setSharesToBook(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-forest-500 outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-xs space-y-1.5">
                <div className="flex justify-between text-forest-900">
                  <span>Price per Share:</span>
                  <span className="font-bold">${Number(selectedProject.sharePrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-forest-900 text-sm font-black pt-1 border-t border-forest-200">
                  <span>Total Investment Amount:</span>
                  <span>${(sharesToBook * Number(selectedProject.sharePrice)).toFixed(2)} USD</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBooking}
                  className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isBooking ? 'Issuing Digital Certificate...' : 'Confirm & Issue Share Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Project Management Modal (Add / Edit) */}
      <ProjectManagementModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setProjectToEdit(null);
        }}
        onSuccess={loadProjects}
        projectToEdit={projectToEdit}
      />

      {/* Admin Financial Plan & Projections Modal */}
      <FinancialPlanManagementModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        onSuccess={loadFinancialPlan}
        currentPlan={financialPlan}
      />
    </div>
  );
}
