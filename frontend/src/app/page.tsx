'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { ProductManagementModal } from '@/components/products/ProductManagementModal';
import {
  ShoppingBag,
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  Package,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const { addItem, openDrawer } = useCartStore();
  const { isStaff, currentUser } = useAuthStore();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Unable to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete '${product.title}'?`)) {
      try {
        await api.deleteProduct(product.id);
        loadProducts();
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-forest-500/20 text-forest-300 border border-forest-400/30">
              Nomini Group Direct Storefront
            </span>
            <span className="text-[11px] sm:text-xs text-slate-300 hidden sm:inline">
              Sustainable Growth. Better Future.
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Pure, Chemical-Free Agro Products with Digital Traceability
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every item purchased from our Fulbari & Rangpur facilities is backed by a cryptographic Digital Product Passport (DPP) detailing farm plot coordinates, ISO/HACCP lab assays, and carbon negative footprint metrics.
          </p>
        </div>
      </div>

      {/* Staff Management Action Bar (Admin & Employee only) */}
      {isStaff() && (
        <div className="bg-white rounded-2xl p-4 border border-forest-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center flex-shrink-0 font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Staff Product Management ({currentUser?.role})
              </h3>
              <p className="text-[11px] text-slate-500">
                You have staff privileges to add, update stock, edit pricing, and link DPP passports.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setProductToEdit(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Harvest Product</span>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-forest-200 border-t-forest-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading verified harvests...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center text-rose-800 text-xs font-semibold">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              {/* Product Image & Batch Badge */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                </Link>

                {product.batch && (
                  <div className="absolute top-3 right-3">
                    <Link
                      href={`/dpp/${product.batch.batchNumber}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/95 backdrop-blur-md text-forest-800 shadow-md border border-forest-200 hover:bg-white transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5 text-forest-600" />
                      <span>DPP Verified</span>
                    </Link>
                  </div>
                )}

                {product.category && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-sm text-white">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {product.originFarm || 'Nomini Estate'}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {product.stockQty} In Stock
                    </span>
                  </div>

                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-forest-700 transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Batch Info Snippet */}
                {product.batch && (
                  <div className="p-3 rounded-2xl bg-forest-50/60 border border-forest-100/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-forest-800 font-semibold truncate">
                      <Leaf className="w-4 h-4 text-forest-600 flex-shrink-0" />
                      <span className="truncate">{product.batch.batchNumber}</span>
                    </div>
                    <Link
                      href={`/dpp/${product.batch.batchNumber}`}
                      className="text-[11px] font-bold text-forest-700 hover:underline flex-shrink-0 flex items-center gap-0.5"
                    >
                      Passport <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Staff Actions & Customer Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Price</span>
                      <span className="text-xl font-black text-slate-900">
                        ${Number(product.priceUSD).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addItem(product, 1)}
                        className="px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-md shadow-forest-600/20 transition-all flex items-center space-x-1.5 hover:scale-105"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* Staff Edit / Delete Controls */}
                  {isStaff() && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setProductToEdit(product);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-forest-600" />
                        <span>Edit</span>
                      </button>

                      {currentUser?.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Management Modal */}
      <ProductManagementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={loadProducts}
        productToEdit={productToEdit}
      />
    </div>
  );
}
