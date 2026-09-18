'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Product, Batch, Category, SubCategory } from '@/types';
import { FileUpload } from '@/components/common/FileUpload';
import { CategoryManagementModal } from '@/components/admin/CategoryManagementModal';
import {
  X,
  Package,
  Layers,
  AlertCircle,
  Settings,
  Plus,
  Tag,
} from 'lucide-react';

interface ProductManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: Product | null;
}

export const ProductManagementModal: React.FC<ProductManagementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
}) => {
  const isEditing = !!productToEdit;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceUSD, setPriceUSD] = useState<string>('15.00');
  const [stockQty, setStockQty] = useState<string>('100');

  // Category & Sub-Category State
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [originFarm, setOriginFarm] = useState('Nomini Agro Zone, Fulbari, Dinajpur, Bangladesh');
  const [imageUrl, setImageUrl] = useState('');
  const [batchId, setBatchId] = useState('');

  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
      return data;
    } catch (err) {
      console.error('Failed to load categories:', err);
      return [];
    }
  };

  const loadBatches = async () => {
    try {
      const batches = await api.getAllBatches();
      setAvailableBatches(batches);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBatches();
      loadCategories().then((cats) => {
        if (productToEdit) {
          setTitle(productToEdit.title);
          setDescription(productToEdit.description || '');
          setPriceUSD(String(productToEdit.priceUSD));
          setStockQty(String(productToEdit.stockQty));
          setOriginFarm(productToEdit.originFarm || 'Nomini Agro Zone, Fulbari, Dinajpur, Bangladesh');
          setImageUrl(productToEdit.imageUrl || '');
          setBatchId(productToEdit.batch?.batchNumber || productToEdit.batchId || '');

          // Resolve category & sub-category
          let foundCat = cats.find(
            (c) => c.id === productToEdit.categoryId || c.name.toLowerCase() === (productToEdit.category || '').toLowerCase(),
          );
          if (!foundCat && cats.length > 0) {
            foundCat = cats[0];
          }

          if (foundCat) {
            setSelectedCategoryId(foundCat.id);
            const foundSub = foundCat.subCategories.find(
              (s) =>
                s.id === productToEdit.subCategoryId ||
                s.name.toLowerCase() === (productToEdit.subCategoryName || '').toLowerCase(),
            );
            if (foundSub) {
              setSelectedSubCategoryId(foundSub.id);
            } else if (foundCat.subCategories.length > 0) {
              setSelectedSubCategoryId(foundCat.subCategories[0].id);
            } else {
              setSelectedSubCategoryId('');
            }
          }
        } else {
          // Defaults for new product
          setTitle('');
          setDescription('');
          setPriceUSD('18.00');
          setStockQty('200');
          setOriginFarm('Nomini Agro Zone, Fulbari, Dinajpur, Bangladesh');
          setImageUrl('https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800');
          setBatchId('');

          if (cats.length > 0) {
            setSelectedCategoryId(cats[0].id);
            if (cats[0].subCategories.length > 0) {
              setSelectedSubCategoryId(cats[0].subCategories[0].id);
            } else {
              setSelectedSubCategoryId('');
            }
          }
        }
      });
      setError(null);
    }
  }, [isOpen, productToEdit]);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const activeSubCategories = activeCategory?.subCategories || [];

  const handleCategoryChange = (newCatId: string) => {
    setSelectedCategoryId(newCatId);
    const cat = categories.find((c) => c.id === newCatId);
    if (cat && cat.subCategories.length > 0) {
      setSelectedSubCategoryId(cat.subCategories[0].id);
    } else {
      setSelectedSubCategoryId('');
    }
  };

  const handleCategoryUpdated = async () => {
    const updatedCats = await loadCategories();
    // Maintain or adjust current selection
    if (updatedCats.length > 0) {
      const stillExists = updatedCats.find((c) => c.id === selectedCategoryId);
      if (!stillExists) {
        setSelectedCategoryId(updatedCats[0].id);
        if (updatedCats[0].subCategories.length > 0) {
          setSelectedSubCategoryId(updatedCats[0].subCategories[0].id);
        } else {
          setSelectedSubCategoryId('');
        }
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Product title is required');
      return;
    }

    if (!selectedCategoryId) {
      setError('Product Category is required. Please select or add a category.');
      return;
    }

    if (!selectedSubCategoryId) {
      setError('Product Sub-Category is required. Every product must have a sub-category.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const chosenCat = categories.find((c) => c.id === selectedCategoryId);
    const chosenSubCat = chosenCat?.subCategories.find((s) => s.id === selectedSubCategoryId);

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      priceUSD: parseFloat(priceUSD) || 0,
      stockQty: parseInt(stockQty, 10) || 0,
      categoryId: selectedCategoryId,
      category: chosenCat?.name || 'Organic Spices',
      subCategoryId: selectedSubCategoryId,
      subCategoryName: chosenSubCat?.name || undefined,
      originFarm: originFarm.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      batchId: batchId.trim() || undefined,
    };

    try {
      if (isEditing && productToEdit) {
        await api.updateProduct(productToEdit.id, payload);
      } else {
        await api.createProduct(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setError(err.message || 'Failed to save product details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-slate-100 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isEditing ? 'Edit E-Commerce Product' : 'Add New Harvest Product'}
                </h3>
                <p className="text-xs text-slate-500">
                  Manage stock, pricing, category taxonomy, origin, and linked DPP passport
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
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nomini Estate Organic Black Pepper (250g)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Single-estate whole black pepper cultivated with solar drip irrigation in Dinajpur..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>

            {/* Category & Sub-Category Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Taxonomy & Classification *
                </span>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage Categories
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Primary Category *
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
                  >
                    {categories.length === 0 && <option value="">Loading categories...</option>}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Sub-Category *
                  </label>
                  {activeSubCategories.length > 0 ? (
                    <select
                      value={selectedSubCategoryId}
                      onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
                    >
                      <option value="">-- Select Sub-Category --</option>
                      {activeSubCategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      <span>No sub-categories yet</span>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[11px] font-bold underline hover:text-amber-900"
                      >
                        + Add One
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Origin Farm Location
                </label>
                <input
                  type="text"
                  value={originFarm}
                  onChange={(e) => setOriginFarm(e.target.value)}
                  placeholder="Nomini Agro Zone, Fulbari, Dinajpur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Linked DPP Batch Passport
                </label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-forest-500 focus:outline-none bg-white"
                >
                  <option value="">No Batch Linked</option>
                  {availableBatches.map((b) => (
                    <option key={b.id} value={b.batchNumber}>
                      {b.batchNumber} — {b.farmPlot || 'Nomini Plot'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <FileUpload
              label="Product Image"
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              accept="image/*"
              helperText="Upload product photo from your computer (saved permanently to server)"
            />

            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Saving Product...'
                  : isEditing
                  ? 'Update Product'
                  : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onUpdated={handleCategoryUpdated}
        defaultCategoryId={selectedCategoryId}
      />
    </>
  );
};
