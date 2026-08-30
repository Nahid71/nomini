'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { useAuthStore } from '@/lib/store/authStore';
import { Lock, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

export default function AdminTasksPage() {
  const { currentUser, isStaff, isInitialized, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!isInitialized) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-forest-200 border-t-forest-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Verifying staff credentials...</p>
      </div>
    );
  }

  // If not logged in: show Login gate
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-5">
        <div className="w-16 h-16 bg-forest-50 text-forest-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-forest-100">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-forest-100 text-forest-800 border border-forest-200">
            Internal Operations Portal
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Staff Authentication Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The Team Operations Kanban board is an internal workspace for Nomini Group management and field employees. Please sign in to continue.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/login?redirect=/admin/tasks"
            className="px-6 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-lg shadow-forest-600/20 transition-all flex items-center justify-center space-x-2 hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Access Operations</span>
          </Link>
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            Back to Public Home
          </Link>
        </div>
      </div>
    );
  }

  // If logged in as Customer or Investor (non-staff): show clearance gate
  if (!isStaff()) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md space-y-5">
        <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-3xl flex items-center justify-center mx-auto border border-amber-200">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
            Clearance Restricted ({currentUser.role})
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Staff Clearance Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your active profile (<strong>{currentUser.fullName}</strong>) has the <strong>{currentUser.role}</strong> role. Operations management is restricted to Nomini staff (Admin & Employees).
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/login?redirect=/admin/tasks"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Switch to Staff Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <KanbanBoard />
    </div>
  );
}
