'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import nominiEmblem from '@/assets/nomini-emblem.png';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Kanban,
  QrCode,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sun,
  Droplets,
  Sprout,
  Fish,
  Beef,
  Flame,
  Hotel,
  Award,
  Users,
  Building,
  Target,
  Quote,
  Lock,
} from 'lucide-react';

export default function AboutCorporatePage() {
  const { currentUser, isStaff, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const portalTiles = [
    {
      step: 'E-Commerce',
      title: 'Single-Origin Organic Storefront',
      desc: 'Browse verified harvests with full DPP traceability: export-grade Black Tiger Shrimp, cold-pressed virgin oils, organic spices, and bio-fertilizers with instant checkout.',
      icon: ShoppingBag,
      badge: 'Zustand Cart + Checkout',
      href: '/',
      actionText: 'Browse Harvest Products',
      isPublic: true,
    },
    {
      step: 'DPP Passport',
      title: 'Digital Product Passport & Traceability',
      desc: 'Scan QR codes to inspect the complete farm-to-fork journey from Fulbari, Dinajpur — including soil conditioning, chemical spectrometry assays, and carbon scorecards.',
      icon: QrCode,
      badge: 'EU ESPR Compliant',
      href: '/dpp/BATCH-NOM-2026-001',
      actionText: 'Inspect Live DPP Passport',
      isPublic: true,
    },
    {
      step: 'Crowdfarming',
      title: 'Regenerative Farm Investment Portal',
      desc: 'Co-own our $800,000 integrated agro-industrial park, biofloc hatcheries, or 15 MW solar grid. Book farm shares with legally binding digital certificates.',
      icon: TrendingUp,
      badge: 'Digital Share Certificates',
      href: '/investments',
      actionText: 'Explore Crowdfarming Projects',
      isPublic: true,
    },
    {
      step: 'Team Kanban',
      title: 'Operations & Staff Management Board',
      desc: 'Live drag-and-drop Kanban workflow for CEO, COO, and Operations Leads to assign and track farm duties, solar grid syncs, and cold-chain dispatches.',
      icon: Kanban,
      badge: isStaff() ? 'Staff Unlocked' : 'Staff Login Required',
      href: isStaff() ? '/admin/tasks' : '/login?redirect=/admin/tasks',
      actionText: isStaff() ? 'Launch Admin Kanban Board' : 'Sign In as Staff to Access',
      isPublic: false,
    },
  ];

  const sixDivisions = [
    {
      title: 'Agriculture & Precision Crops',
      desc: 'High-yield Paddy (Rice), Wheat, Corn, Pulses, and high-value organic Spices (Cardamom, Black Pepper, Turmeric, Ginger) with IoT solar drip irrigation.',
      icon: Sprout,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Advanced Biofloc Aquaculture',
      desc: 'High-tech Recirculating Aquaculture Systems (RAS) & Biofloc hatcheries cultivating Black Tiger Shrimp, Carp, and Tilapia with US FDA/EU export hygiene.',
      icon: Fish,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      title: 'Dairy & Livestock Farming',
      desc: 'Holstein Friesian automated milking parlors, scientific cattle fattening beef programs, Black Bengal goat husbandry, and eco-controlled layer/broiler poultry.',
      icon: Beef,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Food Processing & Bio-Fibers',
      desc: 'State-of-the-art cold extraction for virgin oils, botanical leaf powders (Moringa, Stevia), and upcycled Banana, Pineapple & Water Hyacinth natural fiber yarn.',
      icon: Leaf,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      title: '15 MW Renewable Bio-Energy',
      desc: 'Closed-loop circular grid converting agricultural manure into 25,000 MT/year organic bio-fertilizer and generating 15 MW solar/biogas clean energy.',
      icon: Flame,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      title: 'Eco-Agro Tourism & Training',
      desc: 'Demonstration eco-farm resorts, agricultural training & farmer incubation centers in Fulbari, Dinajpur empowering over 10,000 local farming families.',
      icon: Hotel,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const executiveTeam = [
    {
      name: 'Abu Bakar Siddique',
      role: 'Founder of Nomini Group',
      dept: 'Founder & Strategic Vision',
      avatar: '/team/abu-bakar-siddique.jpeg',
      badge: 'Founder',
    },
    {
      name: 'Md. Abdul Wares',
      role: 'President, CEO',
      dept: 'Executive Leadership & Operations',
      avatar: '/team/md-abdul-wares.jpeg',
      badge: 'Executive Board',
    },
    {
      name: 'MD. Shahadat Hossain',
      role: 'Vice President Finance',
      dept: 'Corporate Finance & Accounts',
      avatar: '/team/md-shahadat-hossain.jpeg',
      badge: 'Finance',
    },
    {
      name: 'MD. Anwar Hossain',
      role: 'Vice President Sales & Marketing',
      dept: 'Sales & Market Development',
      avatar: '/team/md-anwar-hossain.jpeg',
      badge: 'Commercial',
    },
    {
      name: 'Mynul Hassan',
      role: 'Vice President Sales',
      dept: 'Commercial & Distribution Sales',
      avatar: '/team/mynul-hassan.jpeg',
      badge: 'Sales',
    },
    {
      name: 'Md. Milon Sheikh',
      role: '1st Vice President (Sourcing)',
      dept: 'Procurement & Strategic Sourcing',
      avatar: '/team/md-milon-sheikh.jpeg',
      badge: 'Sourcing',
    },
    {
      name: 'Rakibul Islam Sourov',
      role: 'Director Sourcing',
      dept: 'Supply Chain & Sourcing Strategy',
      avatar: '/team/rakibul-islam-sourov.jpeg',
      badge: 'Supply Chain',
    },
    {
      name: 'Sandip Kumar Roy',
      role: 'Director & Manager',
      dept: 'Administration & Corporate Affairs',
      avatar: '/team/sandip-kumar-roy.jpeg',
      badge: 'Administration',
    },
    {
      name: 'Sakib Hasan Plabon',
      role: 'HR, Admin, Compliance & Sales Manager',
      dept: 'Human Resources & Regulatory Compliance',
      avatar: '/team/sakib-hasan-plabon.jpeg',
      badge: 'HR & Compliance',
    },
    {
      name: 'Md. Eliyas Ali Sumon',
      role: 'Medical Assistant & IT Manager',
      dept: 'Health, Safety & IT Systems',
      avatar: '/team/md-eliyas-ali-sumon.jpeg',
      badge: 'IT & Medical',
    },
    {
      name: 'Md. Alamin',
      role: 'Supervisor',
      dept: 'Field Operations & Plot Supervision',
      avatar: '/team/md-alamin.jpeg',
      badge: 'Operations',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section with Official Logo & Slogan */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-4">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white p-2.5 shadow-xl border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
              <Image
                src={nominiEmblem}
                alt="Nomini Group & Agro Official Logo"
                width={128}
                height={128}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-forest-800 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
              Group & Agro
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-forest-100 text-forest-800 border border-forest-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-forest-600" /> NOMINI GROUP & AGRO. • EST. 2018
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Pioneering Sustainable Agro-Industrial Excellence in South Asia
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
          “Sustainable Growth. Better Future.” Uniting Precision Agriculture, High-Tech Aquaculture, Automated Dairy, Food Processing, Renewable Bio-Energy, and Eco-Agro Tourism across Bangladesh.
        </p>

        {/* 4 Core Pillars from Official Logo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 text-left">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-black text-emerald-800 uppercase block">Agriculture</span>
            <span className="text-[10px] text-slate-500 font-medium">Sustainable Farming</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-sky-100 shadow-xs">
            <span className="text-[11px] font-black text-sky-800 uppercase block">Fisheries</span>
            <span className="text-[10px] text-slate-500 font-medium">Healthy • Productive</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-amber-100 shadow-xs">
            <span className="text-[11px] font-black text-amber-800 uppercase block">Livestock</span>
            <span className="text-[10px] text-slate-500 font-medium">Better Livelihood</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-orange-100 shadow-xs">
            <span className="text-[11px] font-black text-orange-800 uppercase block">Food & Processing</span>
            <span className="text-[10px] text-slate-500 font-medium">Value • Quality • Safety</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-lg shadow-forest-600/25 transition-all flex items-center justify-center space-x-2 hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore E-Commerce Store</span>
          </Link>
          <Link
            href="/dpp/BATCH-NOM-2026-001"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-sm transition-all flex items-center justify-center space-x-2 hover:scale-105"
          >
            <QrCode className="w-4 h-4 text-forest-600" />
            <span>Verify DPP Passport</span>
          </Link>
          <Link
            href="/investments"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 hover:scale-105"
          >
            <TrendingUp className="w-4 h-4" />
            <span>$800k Crowdfarming Model</span>
          </Link>
          {isStaff() && (
            <Link
              href="/admin/tasks"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 hover:scale-105"
            >
              <Kanban className="w-4 h-4" />
              <span>Operations Kanban</span>
            </Link>
          )}
        </div>
      </section>

      {/* 4 Interactive Application Portal Tiles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md">
              Digital Platform Hub
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Core Application Modules
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline font-semibold">
            Live Connected Services
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portalTiles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-forest-300 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-forest-700 bg-forest-50 px-2.5 py-1 rounded-lg border border-forest-100">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-forest-700 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={item.href}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-forest-700 hover:text-forest-800 transition-colors"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Message from Managing Director (Md. Abdul Wares) */}
      <section className="bg-gradient-to-br from-forest-950 via-slate-900 to-forest-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-forest-500/20 text-forest-300 border border-forest-400/30">
              Executive Message
            </span>
            <span className="text-xs text-slate-400">Message from the Managing Director</span>
          </div>

          <blockquote className="text-lg sm:text-2xl font-medium text-slate-100 leading-relaxed italic">
            “Nomini Group was established in 2018 with a bold, visionary objective: to modernize traditional agro-industrial practices through closed-loop circular systems, climate-smart technologies, and high-efficiency management frameworks. Our multi-sector integration positions us uniquely to solve national food security challenges while creating substantial socio-economic value.”
          </blockquote>

          <div className="pt-4 border-t border-forest-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <img
                src="/team/md-abdul-wares.jpeg"
                alt="Md. Abdul Wares - President & CEO"
                className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-forest-400/60 shadow-lg flex-shrink-0 bg-forest-900"
              />
              <div>
                <h4 className="text-base font-black text-white">Md. Abdul Wares</h4>
                <p className="text-xs text-forest-300 font-bold">President & CEO • NOMINI GROUP & AGRO.</p>
                <p className="text-[11px] text-slate-400">Fulbari, Dinajpur, Rangpur, Bangladesh</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-xs text-slate-300 border-t md:border-t-0 pt-3 md:pt-0 border-forest-800/60">
              <div className="text-center bg-white/5 md:bg-transparent p-2.5 md:p-0 rounded-xl">
                <span className="text-lg sm:text-xl font-black text-forest-400 block">100%</span>
                <span className="text-[10px] sm:text-xs">Traceable Purity</span>
              </div>
              <div className="text-center bg-white/5 md:bg-transparent p-2.5 md:p-0 rounded-xl">
                <span className="text-lg sm:text-xl font-black text-forest-400 block">6 Core</span>
                <span className="text-[10px] sm:text-xs">Synergies</span>
              </div>
              <div className="text-center bg-white/5 md:bg-transparent p-2.5 md:p-0 rounded-xl">
                <span className="text-lg sm:text-xl font-black text-forest-400 block">Zero Waste</span>
                <span className="text-[10px] sm:text-xs">Circular Goal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Business Units (Synergies Through Closed-Loop Systems) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Integrated Agro-Industrial Synergies
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our 6 Core Business Divisions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Unlike fragmented traditional farming, Nomini Group connects organic waste, bio-energy, water, and livestock into a zero-waste circular loop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sixDivisions.map((div, i) => {
            const Icon = div.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${div.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{div.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{div.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Impact Metrics & 2035 Roadmap from PDF */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Impact Targets */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md">
              Key Performance Metrics
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">Impact Milestones (2026–2028)</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-forest-50/60 border border-forest-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Clean Energy Generation</span>
                  <div className="text-xl font-black text-forest-900 mt-0.5">15 MW Agro-Solar Grid</div>
                </div>
                <span className="text-[10px] font-bold text-forest-700 bg-forest-200/80 px-2 py-0.5 rounded-full">
                  Target 2028
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Long-term goal: 50+ MW clean energy by 2035</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Organic Bio-Fertilizer</span>
                  <div className="text-xl font-black text-amber-900 mt-0.5">25,000 Metric Tons/Yr</div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Target 2028
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Long-term goal: 100,000 MT/year by 2035</p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500">Contract Farming Reach</span>
                  <div className="text-xl font-black text-sky-900 mt-0.5">10,000+ Farming Families</div>
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-200/80 px-2 py-0.5 rounded-full">
                  Target 2028
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Long-term goal: 50,000 agro-partners by 2035</p>
            </div>
          </div>
        </div>

        {/* Right: Vision 2035 3-Phase Roadmap */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md">
              Strategic Vision 2035 Roadmap
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">3-Phase Development Journey</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-forest-700 bg-forest-100 px-2 py-0.5 rounded-md">
                  Phase 1: 2026 – 2028
                </span>
                <strong className="text-xs font-bold text-slate-900">Nationwide Footprint</strong>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Establish regional processing hubs in key agricultural zones across Bangladesh; scale contract farming network to 10,000+ growers; deploy 15 MW solar & 25,000 MT bio-fertilizer facilities.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  Phase 2: 2029 – 2031
                </span>
                <strong className="text-xs font-bold text-slate-900">Global Export Expansion</strong>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Obtain full EU, US FDA, and Middle Eastern export certifications; launch frozen seafood, organic spices, and eco-fiber export channels worldwide.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  Phase 3: 2032 – 2035
                </span>
                <strong className="text-xs font-bold text-slate-900">Mega Agro-Industrial Park</strong>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Construct one of South Asia’s largest integrated mega agro-industrial parks in Dinajpur powered 100% by solar and biogas with advanced cold-chain logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team from Files */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-forest-700 bg-forest-100 px-3.5 py-1 rounded-full border border-forest-200">
            Executive Leadership & Management Team
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The Team of Nomini Group
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Visionary founders, seasoned directors, and operations leads driving South Asia’s sustainable agro-industrial revolution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {executiveTeam.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs text-center space-y-4 hover:shadow-xl hover:border-forest-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                {/* Photo with subtle badge */}
                <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
                  <img
                    src={member.avatar}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full rounded-2xl object-cover object-top border-2 border-slate-200 group-hover:border-forest-500 shadow-md group-hover:scale-105 transition-all duration-300 bg-slate-100"
                  />
                  {member.badge && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-forest-800 text-white shadow-sm whitespace-nowrap">
                      {member.badge}
                    </span>
                  )}
                </div>

                {/* Name & Designation */}
                <div className="pt-1 space-y-1">
                  <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-forest-700 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs font-bold text-forest-700 leading-snug">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Department / Scope Footer */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 block truncate">
                  {member.dept}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

