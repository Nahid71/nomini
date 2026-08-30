'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import nominiEmblem from '@/assets/nomini-emblem.png';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
  Shield,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { currentUser, login, register, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'INVESTOR'>('CUSTOMER');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      router.push(redirectUrl);
    }
  }, [currentUser, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'LOGIN') {
      const res = await login(email.trim(), password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } else {
      if (!fullName.trim() || !email.trim() || !password) {
        setErrorMsg('Please fill in all required fields');
        return;
      }
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        department: department.trim() || undefined,
      });
      if (res.success) {
        setSuccessMsg('Account registered successfully! Redirecting...');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-2 rounded-3xl border border-slate-200/80 shadow-lg flex items-center justify-center mx-auto">
          <Image
            src={nominiEmblem}
            alt="Nomini Group & Agro"
            width={80}
            height={80}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Nomini Corporate Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Sign in with your verified credentials to access role-based Team Operations, Product Management, and DPP Passport services.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Sign In / Register */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                mode === 'LOGIN'
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('REGISTER');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                mode === 'REGISTER'
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Account Type *
                    </label>
                    <select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white font-bold text-slate-800"
                    >
                      <option value="CUSTOMER">Customer / Food Buyer</option>
                      <option value="INVESTOR">Farm Co-Owner / Investor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Organization / Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Retail Off-Taker or Private Investor"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Corporate Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-black text-xs shadow-lg shadow-forest-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              <span>{mode === 'LOGIN' ? 'Sign In to Portal' : 'Register & Enter Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Platform Access & Security Governance Notice */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded-md border border-forest-100">
                Security & Role Governance
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-1.5">
                Nomini Group Access Policy
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Our platform enforces strict role-based access control (RBAC) to ensure food safety traceability and data integrity.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Customer Accounts</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Self-registration enabled. Direct access to chemical-free agro store and digital DPP traceability.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Investor Accounts</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Self-registration enabled. Participate in the $800k crowdfarming expansion and receive digital share certificates.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Staff & Admin Clearance</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Employee and administrator accounts are restricted. Only authorized Administrators can provision staff clearance.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Need staff clearance? Contact HQ IT Administrator at{' '}
              <a href="mailto:admin@nominigroup.com" className="text-forest-700 font-bold hover:underline">
                admin@nominigroup.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-forest-200 border-t-forest-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading Nomini Portal...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

