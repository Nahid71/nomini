'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { User, Role } from '@/types';
import { FileUpload } from '@/components/common/FileUpload';
import {
  X,
  UserPlus,
  ShieldCheck,
  Briefcase,
  Sprout,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  Users,
} from 'lucide-react';

interface StaffManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffChanged?: () => void;
}

export const StaffManagementModal: React.FC<StaffManagementModalProps> = ({
  isOpen,
  onClose,
  onStaffChanged,
}) => {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE'>('LIST');
  const [staffList, setStaffList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'EMPLOYEE' | 'FARM_OPERATOR'>('EMPLOYEE');
  const [department, setDepartment] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadStaff();
    }
  }, [isOpen]);

  const loadStaff = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAllUsers();
      // Filter to staff & admin members
      const staffMembers = data.filter((u: User) =>
        ['ADMIN', 'EMPLOYEE', 'FARM_OPERATOR'].includes(u.role)
      );
      setStaffList(staffMembers);
    } catch (err: any) {
      console.error('Failed to load staff list:', err);
      setError(err.message || 'Failed to load staff accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await api.createStaff({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        department: department.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });

      setSuccess(`Staff account '${fullName}' provisioned successfully!`);
      setFullName('');
      setEmail('');
      setPassword('');
      setDepartment('');
      setAvatarUrl('');
      setRole('EMPLOYEE');
      loadStaff();
      if (onStaffChanged) onStaffChanged();
      setTimeout(() => {
        setActiveTab('LIST');
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to provision staff account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.id === currentUser?.id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (confirm(`Are you sure you want to remove staff account for '${user.fullName}' (${user.email})?`)) {
      try {
        await api.deleteUser(user.id);
        loadStaff();
        if (onStaffChanged) onStaffChanged();
      } catch (err: any) {
        alert(err.message || 'Failed to delete staff member');
      }
    }
  };

  if (!isOpen) return null;

  const getRoleBadgeStyle = (r?: string) => {
    switch (r) {
      case 'ADMIN':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'EMPLOYEE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FARM_OPERATOR':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
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
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Staff & User Management
              </h3>
              <p className="text-xs text-slate-500">
                Admin-only portal to provision and manage employee & administrative accounts
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

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('LIST');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'LIST'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Staff Directory ({staffList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('CREATE');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'CREATE'
                ? 'bg-white text-forest-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Provision New Staff Account</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab 1: Staff Directory */}
        {activeTab === 'LIST' && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-500 font-semibold">
                Loading staff directory...
              </div>
            ) : staffList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No staff members found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden max-h-[380px] overflow-y-auto">
                {staffList.map((user) => {
                  const isCurrent = user.id === currentUser?.id;
                  return (
                    <div
                      key={user.id}
                      className="p-3 sm:p-4 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                            {user.fullName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {user.fullName}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-black text-forest-700 bg-forest-100 px-1.5 py-0.2 rounded">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {user.department || 'Operations'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getRoleBadgeStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>

                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove staff account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Provision Staff Form */}
        {activeTab === 'CREATE' && (
          <form onSubmit={handleCreateStaff} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Md. Tariqul Islam"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Staff Role *
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white font-bold text-slate-800"
                >
                  <option value="EMPLOYEE">Employee (Department Staff / Lead)</option>
                  <option value="FARM_OPERATOR">Farm Operator (Field Agronomist / Hatchery)</option>
                  <option value="ADMIN">Executive / Administrator (Full Clearance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department / Job Title
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Fulbari Biofloc Hub"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Staff Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tariqul.ops@nominigroup.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Initial / Temporary Password * (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="NominiPass2026!"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <FileUpload
              label="Staff Profile Photo (Optional)"
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url)}
              accept="image/*"
              helperText="Upload staff profile photo from your computer (stored permanently on server)"
            />

            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('LIST')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Provisioning Staff Account...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Provision Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

