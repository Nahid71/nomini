'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Category, SubCategory } from '@/types';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  ShieldCheck,
  Leaf,
  Settings,
  X,
  ArrowRight,
  Package,
  Award,
} from 'lucide-react';

interface CategoryMegaMenuProps {
  categories: Category[];
  activeCategorySlug: string;
  activeSubCategorySlug: string;
  onSelectCategory: (categorySlug: string) => void;
  onSelectSubCategory: (categorySlug: string, subCategorySlug: string) => void;
  onClearFilters: () => void;
  onOpenCategoryManager?: () => void;
  isStaff?: boolean;
  totalProductsCount: number;
}

export const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({
  categories,
  activeCategorySlug,
  activeSubCategorySlug,
  onSelectCategory,
  onSelectSubCategory,
  onClearFilters,
  onOpenCategoryManager,
  isStaff,
  totalProductsCount,
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoveredCategoryTabId, setHoveredCategoryTabId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Split categories into 4 vertical columns for the Amazon-style mega menu
  const numColumns = 4;
  const categoryColumns: Category[][] = Array.from({ length: numColumns }, () => []);
  categories.forEach((cat, idx) => {
    categoryColumns[idx % numColumns].push(cat);
  });

  // Find active category & sub-category objects for the breadcrumb bar
  const activeCategory =
    activeCategorySlug !== 'all'
      ? categories.find(
          (c) =>
            c.slug === activeCategorySlug ||
            c.id === activeCategorySlug ||
            c.name.toLowerCase() === activeCategorySlug.toLowerCase(),
        )
      : null;

  const activeSubCategory =
    activeCategory && activeSubCategorySlug !== 'all'
      ? activeCategory.subCategories.find(
          (s) =>
            s.slug === activeSubCategorySlug ||
            s.id === activeSubCategorySlug ||
            s.name.toLowerCase() === activeSubCategorySlug.toLowerCase(),
        )
      : null;

  return (
    <div className="relative w-full z-30">
      {/* ---------------------------------------------------- */}
      {/* Amazon-Style Sub-Navigation Bar                      */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white border-y border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-slate-700">
            {/* Storefront Title */}
            <button
              onClick={() => onSelectCategory('all')}
              className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5 pr-2 sm:pr-4 border-r border-slate-200 flex-shrink-0 hover:text-emerald-700 transition-colors"
            >
              <span>Nomini Store</span>
            </button>

            {/* "Categories ▾" Trigger with Hover Expansion */}
            <div
              className="relative flex-shrink-0"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
                  isMegaMenuOpen
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-xs'
                    : 'text-slate-900 hover:text-emerald-700 hover:bg-slate-100'
                }`}
              >
                <span>Categories</span>
                {isMegaMenuOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-emerald-600 transition-transform" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform" />
                )}
              </button>
            </div>

            {/* Quick Access Category Tabs on the Bar */}
            {categories.slice(0, 5).map((cat) => {
              const isActive = activeCategory?.id === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative group flex-shrink-0"
                  onMouseEnter={() => setHoveredCategoryTabId(cat.id)}
                  onMouseLeave={() => setHoveredCategoryTabId(null)}
                >
                  <button
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-emerald-800 bg-emerald-50 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.subCategories.length > 0 && (
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </button>

                  {/* Individual Mini-Dropdown on Tab Hover */}
                  {hoveredCategoryTabId === cat.id && cat.subCategories.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-900 truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {cat.subCategories.length} subs
                        </span>
                      </div>
                      <div className="max-h-60 overflow-y-auto py-1">
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onSelectSubCategory(cat.slug, sub.slug);
                              setHoveredCategoryTabId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors block truncate"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Action: Admin Category Manager */}
          {isStaff && onOpenCategoryManager && (
            <button
              onClick={onOpenCategoryManager}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 transition-colors whitespace-nowrap ml-2"
              title="Add or Edit Categories & Sub-Categories"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Manage Categories</span>
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Mega Menu Dropdown (Expands on Hover over Categories) */}
      {/* ---------------------------------------------------- */}
      {isMegaMenuOpen && (
        <>
          {/* Backdrop Shadow Overlay */}
          <div
            className="fixed inset-0 top-[140px] bg-black/25 backdrop-blur-[1px] z-30 transition-opacity"
            onClick={() => setIsMegaMenuOpen(false)}
          />

          <div
            className="absolute left-0 right-0 top-full bg-white border-b-2 border-slate-300 shadow-2xl rounded-b-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* 1. Left Column: "Featured" Action Buttons (Amazon Style) */}
                <div className="w-full lg:w-56 flex-shrink-0 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-200 lg:pr-6 pb-4 lg:pb-0">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Featured
                  </h4>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onSelectCategory('all');
                        setIsMegaMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                        activeCategorySlug === 'all'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        All Harvests
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 font-mono">
                        {totalProductsCount}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectCategory('organic-spices');
                        setIsMegaMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        Single-Estate Spices
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectCategory('seafood-aquaculture');
                        setIsMegaMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Biofloc Tiger Shrimp
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectCategory('gourmet-oils-botanicals');
                        setIsMegaMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Cold-Pressed Virgin Oils
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectCategory('renewable-bio-energy-soil');
                        setIsMegaMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Organic Bio-Fertilizer
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>

                  {isStaff && onOpenCategoryManager && (
                    <div className="pt-3 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setIsMegaMenuOpen(false);
                          onOpenCategoryManager();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Manage Categories</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Right Multi-Column Grid of Categories & Sub-Categories */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  {categoryColumns.map((colCategories, colIdx) => (
                    <div key={colIdx} className={`${colIdx > 0 ? 'sm:pl-6' : ''} space-y-6 pt-4 sm:pt-0`}>
                      {colCategories.map((cat) => (
                        <div key={cat.id} className="space-y-2.5">
                          {/* Category Header (Clickable) */}
                          <button
                            onClick={() => {
                              onSelectCategory(cat.slug);
                              setIsMegaMenuOpen(false);
                            }}
                            className="group flex items-center justify-between w-full text-left"
                          >
                            <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                              {cat._count?.products ?? cat.subCategories.length}
                            </span>
                          </button>

                          {/* Sub-Category Links */}
                          <ul className="space-y-1.5">
                            {cat.subCategories.map((sub) => {
                              const isSubSelected =
                                activeCategory?.id === cat.id &&
                                (activeSubCategory?.id === sub.id ||
                                  activeSubCategorySlug === sub.slug);
                              return (
                                <li key={sub.id}>
                                  <button
                                    onClick={() => {
                                      onSelectSubCategory(cat.slug, sub.slug);
                                      setIsMegaMenuOpen(false);
                                    }}
                                    className={`text-xs text-left w-full block py-0.5 transition-all truncate ${
                                      isSubSelected
                                        ? 'text-emerald-700 font-bold translate-x-1'
                                        : 'text-slate-600 hover:text-emerald-700 hover:translate-x-1 hover:font-medium'
                                    }`}
                                  >
                                    {sub.name}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------------------------------------------- */}
      {/* Active Filter Breadcrumb & Sub-Category Pill Bar      */}
      {/* ---------------------------------------------------- */}
      {activeCategory && (
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium">Viewing:</span>
              <button
                onClick={() => onSelectCategory('all')}
                className="text-slate-600 hover:text-slate-900 font-bold"
              >
                All Harvests
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-extrabold text-emerald-800">{activeCategory.name}</span>
              {activeSubCategory && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {activeSubCategory.name}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sibling Sub-Categories Quick Filter Pills */}
              <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => onSelectCategory(activeCategory.slug)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    activeSubCategorySlug === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  All {activeCategory.name.split(' ')[0]}
                </button>
                {activeCategory.subCategories.map((sub) => {
                  const isSubActive = activeSubCategorySlug === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onSelectSubCategory(activeCategory.slug, sub.slug)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
                        isSubActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>

              {/* Clear Filter Button */}
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
