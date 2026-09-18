'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Category, SubCategory } from '@/types';
import {
  X,
  Layers,
  FolderPlus,
  Edit2,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  ChevronRight,
  Sparkles,
  Package,
} from 'lucide-react';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  defaultCategoryId?: string;
}

export const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
  isOpen,
  onClose,
  onUpdated,
  defaultCategoryId,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Category creation / edit state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  // SubCategory creation / edit state
  const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<string | null>(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryDesc, setSubCategoryDesc] = useState('');
  const [subCategorySubmitting, setSubCategorySubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCategories();
      setCategories(data);
      if (data.length > 0) {
        if (defaultCategoryId && data.some((c) => c.id === defaultCategoryId)) {
          setSelectedCategoryId(defaultCategoryId);
        } else if (!selectedCategoryId || !data.some((c) => c.id === selectedCategoryId)) {
          setSelectedCategoryId(data[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      setIsAddingCategory(false);
      setEditingCategoryId(null);
      setIsAddingSubCategory(false);
      setEditingSubCategoryId(null);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || null;

  // Category Actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setCategorySubmitting(true);
      setError(null);

      if (editingCategoryId) {
        await api.updateCategory(editingCategoryId, {
          name: categoryName.trim(),
          description: categoryDesc.trim() || undefined,
        });
        setSuccess('Category updated successfully');
      } else {
        const created = await api.createCategory({
          name: categoryName.trim(),
          description: categoryDesc.trim() || undefined,
        });
        setSelectedCategoryId(created.id);
        setSuccess('Category created successfully');
      }

      setCategoryName('');
      setCategoryDesc('');
      setIsAddingCategory(false);
      setEditingCategoryId(null);
      await loadCategories();
      onUpdated?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const startEditCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || '');
    setIsAddingCategory(true);
  };

  const handleDeleteCategory = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        `Are you sure you want to delete category "${name}"?\nAll its sub-categories will also be removed.`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await api.deleteCategory(id);
      setSuccess(`Category "${name}" deleted`);
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
      }
      await loadCategories();
      onUpdated?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  // SubCategory Actions
  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;
    if (!subCategoryName.trim()) {
      setError('Sub-category name is required');
      return;
    }

    try {
      setSubCategorySubmitting(true);
      setError(null);

      if (editingSubCategoryId) {
        await api.updateSubCategory(editingSubCategoryId, {
          name: subCategoryName.trim(),
          description: subCategoryDesc.trim() || undefined,
        });
        setSuccess('Sub-category updated successfully');
      } else {
        await api.createSubCategory(selectedCategoryId, {
          name: subCategoryName.trim(),
          description: subCategoryDesc.trim() || undefined,
        });
        setSuccess('Sub-category created successfully');
      }

      setSubCategoryName('');
      setSubCategoryDesc('');
      setIsAddingSubCategory(false);
      setEditingSubCategoryId(null);
      await loadCategories();
      onUpdated?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save sub-category');
    } finally {
      setSubCategorySubmitting(false);
    }
  };

  const startEditSubCategory = (sub: SubCategory) => {
    setEditingSubCategoryId(sub.id);
    setSubCategoryName(sub.name);
    setSubCategoryDesc(sub.description || '');
    setIsAddingSubCategory(true);
  };

  const handleDeleteSubCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete sub-category "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await api.deleteSubCategory(id);
      setSuccess(`Sub-category "${name}" deleted`);
      await loadCategories();
      onUpdated?.();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete sub-category');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Manage Categories & Sub-Categories
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Admin Master
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Organize products into structured primary categories and precise sub-categories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[460px]">
          {/* Column 1: Category Master List (5 cols) */}
          <div className="md:col-span-5 border-r border-slate-800 flex flex-col bg-slate-900/50">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Categories ({categories.length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(!isAddingCategory);
                  setEditingCategoryId(null);
                  setCategoryName('');
                  setCategoryDesc('');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Category
              </button>
            </div>

            {/* Category Add/Edit Form */}
            {isAddingCategory && (
              <form
                onSubmit={handleSaveCategory}
                className="p-4 bg-slate-800/60 border-b border-slate-700/70 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>{editingCategoryId ? 'Edit Category' : 'Create New Category'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setEditingCategoryId(null);
                    }}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Spices"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 font-medium mb-1">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Short description for display"
                    value={categoryDesc}
                    onChange={(e) => setCategoryDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={categorySubmitting}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {categorySubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                    {editingCategoryId ? 'Update Category' : 'Save Category'}
                  </button>
                </div>
              </form>
            )}

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
              {loading && categories.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mb-2 text-emerald-500" />
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No categories found. Click &quot;Add Category&quot; to create one.
                </div>
              ) : (
                categories.map((cat) => {
                  const isSelected = cat.id === selectedCategoryId;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                          : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-sm truncate ${
                              isSelected ? 'text-emerald-300' : 'text-slate-200'
                            }`}
                          >
                            {cat.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                            {cat.subCategories?.length || 0} subs
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {cat.description}
                          </p>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                          <Package className="w-3 h-3" />
                          <span>{cat._count?.products ?? 0} products</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => startEditCategory(cat, e)}
                          title="Edit Category"
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
                          title="Delete Category"
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight
                          className={`w-4 h-4 ml-1 transition-transform ${
                            isSelected ? 'text-emerald-400 rotate-90 md:rotate-0' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Sub-Categories of Selected Category (7 cols) */}
          <div className="md:col-span-7 flex flex-col bg-slate-950/40">
            {selectedCategory ? (
              <>
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sub-Categories for
                    </span>
                    <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                      {selectedCategory.name}
                      <span className="text-xs font-normal text-slate-400">
                        ({selectedCategory.subCategories?.length || 0})
                      </span>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSubCategory(!isAddingSubCategory);
                      setEditingSubCategoryId(null);
                      setSubCategoryName('');
                      setSubCategoryDesc('');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Sub-Category
                  </button>
                </div>

                {/* SubCategory Add/Edit Form */}
                {isAddingSubCategory && (
                  <form
                    onSubmit={handleSaveSubCategory}
                    className="p-4 bg-slate-800/60 border-b border-slate-700/70 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span>
                        {editingSubCategoryId
                          ? `Edit Sub-Category in "${selectedCategory.name}"`
                          : `Add New Sub-Category to "${selectedCategory.name}"`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingSubCategory(false);
                          setEditingSubCategoryId(null);
                        }}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-medium mb-1">
                        Sub-Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Black Tiger Shrimp"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-medium mb-1">
                        Description (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Short description"
                        value={subCategoryDesc}
                        onChange={(e) => setSubCategoryDesc(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={subCategorySubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {subCategorySubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                        {editingSubCategoryId ? 'Update Sub-Category' : 'Save Sub-Category'}
                      </button>
                    </div>
                  </form>
                )}

                {/* SubCategories List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {selectedCategory.subCategories?.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 text-xs">
                      No sub-categories yet under {selectedCategory.name}.
                      <br />
                      Click &quot;Add Sub-Category&quot; above to create one.
                    </div>
                  ) : (
                    selectedCategory.subCategories?.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{sub.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                              slug: {sub.slug}
                            </span>
                          </div>
                          {sub.description && (
                            <p className="text-xs text-slate-400 mt-1">{sub.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditSubCategory(sub)}
                            title="Edit Sub-Category"
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubCategory(sub.id, sub.name)}
                            title="Delete Sub-Category"
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm p-6 text-center">
                <Layers className="w-10 h-10 mb-2 opacity-40 text-emerald-400" />
                Select a category from the left to view and manage its sub-categories.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Changes take effect immediately on the store catalog and product filters.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
