'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  ArrowLeft,
  Plus,
  Minus,
  Edit2,
  Trash2,
  Package,
  MapPin,
  Calendar,
  Award,
  Truck,
  ShieldAlert,
  Share2,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { addItem, openDrawer } = useCartStore();
  const { isStaff, currentUser } = useAuthStore();

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProduct(productId);
      setProduct(data);
    } catch (err: any) {
      console.error('Failed to load product:', err);
      setError(err.message || 'Product not found or unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    openDrawer();
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    router.push('/checkout');
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    if (confirm(`Are you sure you want to permanently delete '${product.title}'?`)) {
      try {
        await api.deleteProduct(product.id);
        router.push('/');
      } catch (err: any) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'Nomini Pure Harvest',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-forest-200 border-t-forest-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading product specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-4">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-rose-800 text-sm font-semibold">
          {error || 'The requested product could not be found.'}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQty <= 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-500 font-medium truncate">
          <Link href="/" className="hover:text-forest-700 flex items-center gap-1 font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate">{product.category || 'Harvest'}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          {/* Staff Quick Actions */}
          {isStaff() && (
            <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 text-xs font-bold transition-all flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-forest-600" />
                <span>Edit</span>
              </button>

              {currentUser?.role === 'ADMIN' && (
                <button
                  onClick={handleDeleteProduct}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Product Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm aspect-square max-h-[500px] w-full">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800'}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Category Pill */}
            {product.category && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white shadow-md">
                  {product.category}
                </span>
              </div>
            )}

            {/* DPP Passport Badge */}
            {product.batch && (
              <div className="absolute top-4 right-4">
                <Link
                  href={`/dpp/${product.batch.batchNumber}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white/95 backdrop-blur-md text-forest-900 shadow-lg border border-forest-200 hover:bg-white transition-all"
                >
                  <QrCode className="w-4 h-4 text-forest-600" />
                  <span>DPP Verified</span>
                </Link>
              </div>
            )}

            {/* Origin Farm Footer Badge */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-between text-xs text-slate-800">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span className="font-bold truncate">
                    Origin: {product.originFarm || 'Nomini Agricultural Park, Fulbari'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  {product.sku || 'SKU-NOMINI'}
                </span>
              </div>
            </div>
          </div>

          {/* Quality Guarantees Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
            <div className="space-y-1">
              <Leaf className="w-4 h-4 text-forest-600 mx-auto" />
              <span className="block font-bold text-slate-900 text-[11px]">100% Organic</span>
              <span className="text-[10px] text-slate-500">Zero synthetic chemical</span>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-forest-600 mx-auto" />
              <span className="block font-bold text-slate-900 text-[11px]">ISO 22000 / HACCP</span>
              <span className="text-[10px] text-slate-500">Certified Food Safety</span>
            </div>
            <div className="space-y-1">
              <Truck className="w-4 h-4 text-forest-600 mx-auto" />
              <span className="block font-bold text-slate-900 text-[11px]">Cold-Chain Logistics</span>
              <span className="text-[10px] text-slate-500">Farm fresh delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Purchase Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest-700 bg-forest-50 px-3 py-1 rounded-lg border border-forest-100">
                Pure Single-Origin Harvest
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-lg ${
                  isOutOfStock
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : `${product.stockQty} Units in Stock`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Pricing */}
            <div className="p-4 rounded-2xl bg-forest-50/60 border border-forest-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Direct Farm-Gate Price</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    ${Number(product.priceUSD).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">USD / unit</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-forest-700 font-bold uppercase tracking-wider block">
                  Tax & DPP Included
                </span>
                <span className="text-xs text-slate-600 font-medium">Free returns within 48h</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Product Overview & Agronomy Notes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description ||
                  'Grown using closed-loop circular agriculture methods at Nomini Estates in Fulbari, Dinajpur. Harvested at peak maturity with zero synthetic pesticides or artificial ripening agents. Packed directly into hermetic food-grade containers under ISO 22000 hygiene conditions.'}
              </p>
            </div>
          </div>

          {/* Interactive Quantity Selector & Cart Controls */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Quantity
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-black text-slate-900 text-sm font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                  disabled={quantity >= product.stockQty || isOutOfStock}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Subtotal ({quantity} units):</span>
              <span className="text-lg font-black text-forest-900 font-mono">
                ${(quantity * Number(product.priceUSD)).toFixed(2)} USD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="py-3 px-4 rounded-xl border-2 border-forest-600 text-forest-700 hover:bg-forest-50 font-bold text-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4 text-forest-600" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-black text-xs shadow-md shadow-forest-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-40 hover:scale-102"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Linked DPP Passport Preview Card */}
          {product.batch && (
            <div className="p-5 rounded-3xl bg-forest-950 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-forest-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-forest-300">
                    Digital Product Passport (DPP)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-forest-400 bg-forest-900/60 px-2 py-0.5 rounded border border-forest-800">
                  {product.batch.batchNumber}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Cryptographic harvest telemetry verified on farm plot {product.batch.farmPlot || 'Plot-7A'}. Harvested on {new Date(product.batch.harvestDate).toLocaleDateString()}.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-forest-900">
                <div>
                  <span className="text-slate-400 block text-[10px]">Carbon Rating</span>
                  <strong className="text-emerald-400 font-bold">
                    {product.batch.sustainability?.carbonRating || 'A+ Net Negative'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Soil Health</span>
                  <strong className="text-emerald-400 font-bold">
                    {product.batch.sustainability?.soilHealthIndex || 96}/100
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Water Saved</span>
                  <strong className="text-emerald-400 font-bold">
                    {product.batch.sustainability?.waterConservation || '42% Drip'}
                  </strong>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/dpp/${product.batch.batchNumber}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-forest-500/20 hover:bg-forest-500/30 text-forest-300 border border-forest-400/40 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Cryptographic Passport & Assay Records</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Product Management Modal */}
      <ProductManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadProduct}
        productToEdit={product}
      />
    </div>
  );
}

