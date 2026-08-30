'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { RoleSwitcher } from './RoleSwitcher';
import { GoogleTranslate } from './GoogleTranslate';
import {
  ShoppingBag,
  QrCode,
  Kanban,
  TrendingUp,
  Phone,
  LogIn,
  Menu,
  X,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import nominiEmblem from '@/assets/nomini-emblem.png';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { getItemCount, openDrawer } = useCartStore();
  const { currentUser, isStaff, initAuth, logout } = useAuthStore();
  const cartCount = getItemCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Close mobile menu when navigating to a new route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const allNavLinks = [
    { href: '/', label: 'E-Commerce Store', icon: ShoppingBag, public: true },
    { href: '/dpp/BATCH-NOM-2026-001', label: 'DPP Passport', icon: QrCode, public: true },
    { href: '/investments', label: 'Crowdfarming & ROI', icon: TrendingUp, public: true },
    { href: '/admin/tasks', label: 'Team Operations', icon: Kanban, public: false },
  ];

  // Only show Team Operations to authenticated staff (Admin, Employee, Farm Operator)
  const navLinks = allNavLinks.filter((link) => link.public || isStaff());

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro bar with contact info from PDF */}
      <div className="bg-forest-950 text-white text-[10px] sm:text-[11px] py-1 px-3 sm:px-8 flex flex-wrap items-center justify-between font-medium">
        <div className="flex items-center space-x-2 sm:space-x-3 truncate">
          <span className="text-forest-400 font-bold truncate">NOMINI GROUP</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-300">Sustainable Growth. Better Future.</span>
          <span className="hidden lg:inline text-slate-400">•</span>
          <span className="hidden lg:inline text-slate-300">Fulbari, Dinajpur</span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a href="tel:+8801714864178" className="hover:text-forest-300 flex items-center gap-1 text-[10px] sm:text-xs">
            <Phone className="w-3 h-3 text-forest-400 flex-shrink-0" />
            <span className="font-bold">+880 1714-864178</span>
          </a>
          <a href="mailto:info@nominigroup.com" className="hidden md:inline hover:text-forest-300 text-slate-300">
            info@nominigroup.com
          </a>
          <span className="hidden sm:inline text-slate-600">|</span>
          <GoogleTranslate variant="micro" />
        </div>
      </div>

      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Links to Corporate Overview (/about) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/about"
              className="flex items-center space-x-2 sm:space-x-3 group"
              title="About Nomini Group & Agro (Corporate Portfolio & Executive Team)"
            >
              <Image
                src={nominiEmblem}
                alt="Nomini Group & Agro"
                width={40}
                height={40}
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-xl bg-white shadow-sm border border-slate-100 p-0.5 group-hover:scale-105 transition-transform flex-shrink-0"
                priority
              />
              <div className="min-w-0">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                  NOMINI <span className="text-forest-600">GROUP</span>
                </span>
                <span className="block text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5 sm:-mt-1 truncate">
                  Group & Agro • Est. 2018
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 lg:space-x-2 px-3 lg:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-50 text-forest-700 shadow-sm border border-forest-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-forest-600' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language Switcher, Desktop Role Switcher, Cart Drawer & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Desktop Language Switcher */}
            <div className="hidden lg:block">
              <GoogleTranslate variant="navbar" />
            </div>

            {/* Desktop Auth / Role Switcher */}
            <div className="hidden sm:block">
              {currentUser ? (
                <RoleSwitcher />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-forest-300 bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-bold transition-all shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-forest-700" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={openDrawer}
              className="relative p-2 text-slate-700 hover:text-forest-700 rounded-xl hover:bg-forest-50 border border-slate-200 transition-all flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-forest-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-forest-700 rounded-xl hover:bg-forest-50 border border-slate-200 transition-all flex items-center justify-center min-w-[40px] min-h-[40px]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* User Status Card on Mobile */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-black text-xs">
                        {currentUser.fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{currentUser.fullName}</h4>
                      <p className="text-[10px] text-slate-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-forest-100 text-forest-800 border border-forest-200">
                    {currentUser.role}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <RoleSwitcher />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Welcome, Guest</h4>
                  <p className="text-[10px] text-slate-500">Sign in to access staff operations & certificates</p>
                </div>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-xl bg-forest-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>

          {/* Multi-Language Selector for Mobile */}
          <GoogleTranslate variant="mobile" />

          {/* Navigation Links on Mobile */}
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2">
              Platform Navigation
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-forest-50 text-forest-800 border border-forest-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-forest-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
          </div>

          {/* Contact quick links on mobile */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 px-1">
            <div className="flex items-center justify-between">
              <span>Hotline (24/7):</span>
              <a href="tel:+8801714864178" className="font-bold text-forest-700">
                +880 1714-864178
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span>Email:</span>
              <a href="mailto:info@nominigroup.com" className="font-bold text-slate-700">
                info@nominigroup.com
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

