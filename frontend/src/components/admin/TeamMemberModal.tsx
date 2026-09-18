'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TeamMember } from '@/types';
import { FileUpload } from '@/components/common/FileUpload';
import {
  X,
  UserCheck,
  Image as ImageIcon,
  Briefcase,
  Layers,
  Award,
  Hash,
  Crown,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Save,
  Plus,
} from 'lucide-react';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: TeamMember | null;
  onSaved: () => void;
}

const PRESET_AVATARS = [
  { label: 'Abu Bakar Siddique', path: '/team/abu-bakar-siddique.jpeg' },
  { label: 'Md. Abdul Wares', path: '/team/md-abdul-wares.jpeg' },
  { label: 'MD. Shahadat Hossain', path: '/team/md-shahadat-hossain.jpeg' },
  { label: 'MD. Anwar Hossain', path: '/team/md-anwar-hossain.jpeg' },
  { label: 'Mynul Hassan', path: '/team/mynul-hassan.jpeg' },
  { label: 'Md. Milon Sheikh', path: '/team/md-milon-sheikh.jpeg' },
  { label: 'Rakibul Islam Sourov', path: '/team/rakibul-islam-sourov.jpeg' },
  { label: 'Sandip Kumar Roy', path: '/team/sandip-kumar-roy.jpeg' },
  { label: 'Sakib Hasan Plabon', path: '/team/sakib-hasan-plabon.jpeg' },
  { label: 'Md. Eliyas Ali Sumon', path: '/team/md-eliyas-ali-sumon.jpeg' },
  { label: 'Md. Alamin', path: '/team/md-alamin.jpeg' },
];

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
  onSaved,
}) => {
  const isEditing = !!memberToEdit?.id;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const [avatar, setAvatar] = useState('');
  const [badge, setBadge] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [isFounder, setIsFounder] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name || '');
      setRole(memberToEdit.role || '');
      setDept(memberToEdit.dept || '');
      setAvatar(memberToEdit.avatar || '');
      setBadge(memberToEdit.badge || '');
      setOrder(memberToEdit.order ?? 0);
      setIsFounder(!!memberToEdit.isFounder);
    } else {
      setName('');
      setRole('');
      setDept('');
      setAvatar('');
      setBadge('');
      setOrder(0);
      setIsFounder(false);
    }
    setError(null);
    setSuccess(null);
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError('Please provide at least member Name and Role / Title');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: name.trim(),
      role: role.trim(),
      dept: dept.trim() || undefined,
      avatar: avatar.trim() || undefined,
      badge: badge.trim() || undefined,
      order: Number(order) || 0,
      isFounder,
    };

    try {
      if (isEditing && memberToEdit?.id) {
        await api.updateTeamMember(memberToEdit.id, payload);
        setSuccess('Team member updated successfully!');
      } else {
        await api.createTeamMember(payload);
        setSuccess('New team member added successfully!');
      }
      onSaved();
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Failed to save team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!memberToEdit?.id) return;
    if (!confirm(`Are you sure you want to remove "${memberToEdit.name}" from the team roster?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      await api.deleteTeamMember(memberToEdit.id);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete team member');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-5 sm:p-8 z-10 border border-slate-100 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center flex-shrink-0 font-bold">
              {isEditing ? <UserCheck className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isEditing ? 'Edit Team Member Tile' : 'Add New Team Member'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure profile name, title, image, department, and display position
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
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Live Card Preview */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
            Live Preview on About Page
          </span>
          <div className="max-w-[240px] mx-auto bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center space-y-3">
            <div className="relative mx-auto w-20 h-20">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || 'Avatar'}
                  className="w-full h-full rounded-2xl object-cover object-top border-2 border-forest-300 shadow-sm bg-slate-100"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center font-black text-sm border-2 border-forest-200">
                  {name ? name.substring(0, 2).toUpperCase() : 'NOM'}
                </div>
              )}
              {badge && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-forest-800 text-white shadow-xs whitespace-nowrap">
                  {badge}
                </span>
              )}
            </div>
            <div>
              <h5 className="text-xs font-black text-slate-900 truncate">
                {name || 'Full Name'}
              </h5>
              <p className="text-[11px] font-bold text-forest-700 truncate">
                {role || 'Role / Designation'}
              </p>
              <p className="text-[9px] font-medium text-slate-400 truncate mt-1">
                {dept || 'Department / Scope'}
              </p>
            </div>
            {isFounder && (
              <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Crown className="w-2.5 h-2.5" /> Founder Tile
              </span>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abu Bakar Siddique"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            {/* Role / Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Role / Title *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Founder of Nomini Group"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department / Scope */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department / Operational Scope
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="e.g. Founder & Strategic Vision"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Badge Label (Optional)
              </label>
              <div className="relative">
                <Award className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Founder, Executive Board, Sourcing"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload from Computer */}
          <div>
            <FileUpload
              label="Profile Photo / Image"
              value={avatar}
              onChange={(url) => setAvatar(url)}
              accept="image/*"
              helperText="Upload member photo from your computer (stored permanently on server)"
            />

            {/* Quick Presets */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-bold text-slate-400">Or use executive portrait:</span>
              {PRESET_AVATARS.slice(0, 6).map((preset) => (
                <button
                  key={preset.path}
                  type="button"
                  onClick={() => setAvatar(preset.path)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-forest-100 hover:text-forest-800 text-slate-600 text-[10px] font-medium transition-colors"
                >
                  {preset.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Order / Position */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Display Position / Order (0 = First)
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Is Founder Checkbox */}
            <div className="pt-5 sm:pt-6">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFounder}
                  onChange={(e) => setIsFounder(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  Place in prominent Founder Tile (Row 0, Col 1)
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-5 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting || isSubmitting}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center justify-center space-x-1.5 w-full sm:w-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? 'Removing...' : 'Delete Member'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'Save Changes' : 'Add Team Member'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
