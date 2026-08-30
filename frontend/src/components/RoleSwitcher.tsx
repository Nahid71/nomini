'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { StaffManagementModal } from './admin/StaffManagementModal';
import {
  ShieldAlert,
  Briefcase,
  TrendingUp,
  ShoppingBag,
  Sprout,
  ChevronDown,
  LogOut,
  Kanban,
  UserPlus,
  Mail,
  Building,
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, logout, isStaff, isAdmin } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'EMPLOYEE':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'FARM_OPERATOR':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'INVESTOR':
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case 'CUSTOMER':
      default:
        return <ShoppingBag className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'EMPLOYEE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FARM_OPERATOR':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INVESTOR':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  if (!currentUser) return null;

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white/90 backdrop-blur-md shadow-sm hover:bg-slate-50 transition-all text-xs font-medium text-slate-700"
          aria-label="User Account Menu"
        >
          <span className="flex items-center space-x-1.5">
            {getRoleIcon(currentUser.role)}
            <span className="font-semibold text-slate-900 max-w-[120px] truncate">
              {currentUser.fullName}
            </span>
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRoleBadgeStyle(
              currentUser.role
            )}`}
          >
            {currentUser.role}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] origin-top-right bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-3 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100 space-y-2">
              {/* User Profile Card */}
              <div className="flex items-center space-x-3 pb-2 pt-1 px-1">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-black text-sm flex-shrink-0">
                    {currentUser.fullName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.fullName}
                  </h4>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-500 truncate">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{currentUser.email}</span>
                  </div>
                  {currentUser.department && (
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 truncate">
                      <Building className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{currentUser.department}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Staff & Admin Actions */}
              <div className="py-2 space-y-1">
                {isAdmin() && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsStaffModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-rose-600" />
                    <span>Manage Staff & Provision Accounts</span>
                  </button>
                )}

                {isStaff() && (
                  <Link
                    href="/admin/tasks"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-forest-50 hover:text-forest-800 transition-colors"
                  >
                    <Kanban className="w-4 h-4 text-forest-600" />
                    <span>Operations Kanban Board</span>
                  </Link>
                )}
              </div>

              {/* Logout Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Admin Staff Management Modal */}
      {isAdmin() && (
        <StaffManagementModal
          isOpen={isStaffModalOpen}
          onClose={() => setIsStaffModalOpen(false)}
        />
      )}
    </>
  );
};

