'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getTotal,
    couponCode,
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900">Your Fresh Cart</h2>
              <span className="bg-forest-100 text-forest-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Explore our single-origin harvests with verified Digital Product Passports.
                </p>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="mt-6 inline-flex items-center px-4 py-2 rounded-xl bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors"
                >
                  Browse Harvests
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex space-x-4">
                  <img
                    src={item.product.imageUrl || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300'}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">${Number(item.product.priceUSD).toFixed(2)} each</p>

                    {item.product.batch && (
                      <Link
                        href={`/dpp/${item.product.batch.batchNumber}`}
                        onClick={closeDrawer}
                        className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md hover:bg-forest-100 transition-colors"
                      >
                        <QrCode className="w-3 h-3 text-forest-600" />
                        DPP: {item.product.batch.batchNumber}
                      </Link>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-500 hover:bg-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-5 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-forest-600 font-medium">
                    <span>Discount ({couponCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Standard Cold-Chain Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-forest-700">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-sm shadow-md shadow-forest-600/20 transition-all hover:shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
