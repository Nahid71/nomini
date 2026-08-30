'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/authStore';
import { api } from '@/lib/api';
import { OrderConfirmation } from '@/types';
import confetti from 'canvas-confetti';
import nominiEmblem from '@/assets/nomini-emblem.png';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  Tag,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const { currentUser } = useAuthStore();

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.fullName || 'Alex Morgan');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'alex.buyer@nomini.group');
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Springfield, OR 97477');
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'WISE' | 'CRYPTO'>('STRIPE');
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Card Simulator details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Checkout submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyCoupon(promoInput);
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add products first.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Call Section 7 Backend API: POST /api/v1/orders/checkout
      const response = await api.checkout({
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim(),
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        items: items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
        })),
      });

      if (response && response.order) {
        setOrderConfirmation(response.order);
        clearCart();

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error('Checkout failed:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS RECEIPT VIEW
  if (orderConfirmation) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center">
          <div className="w-20 h-20 bg-white p-1.5 rounded-3xl border border-slate-100 shadow-lg flex items-center justify-center mx-auto mb-4">
            <Image
              src={nominiEmblem}
              alt="Nomini Group & Agro"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-forest-100 text-forest-800 border border-forest-200">
            Payment Confirmed & Verified • Nomini Verified Chain
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Thank You For Supporting Regenerative Agritech!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Order <strong className="text-slate-800">#{orderConfirmation.id}</strong> has been logged to the Nomini cold-chain fulfillment line.
          </p>

          {/* Receipt Breakdown Card */}
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Customer</span>
                <strong className="text-slate-800">{orderConfirmation.customerName}</strong> ({orderConfirmation.customerEmail})
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-semibold">Payment Method</span>
                <strong className="text-slate-800 uppercase">{orderConfirmation.paymentMethod}</strong>
              </div>
            </div>

            {/* Purchased Items List with DPP Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Harvest Traceability & Items
              </h4>
              {orderConfirmation.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">{item.productTitle}</h5>
                    <span className="text-xs text-slate-500">
                      Qty: {item.quantity} × ${Number(item.priceUSD).toFixed(2)}
                    </span>
                  </div>

                  {item.batchNumber && (
                    <Link
                      href={`/dpp/${item.batchNumber}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-700 font-bold text-xs border border-forest-200 transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-forest-600" />
                      <span>View DPP Passport ({item.batchNumber})</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700">Total Paid</span>
              <span className="text-base font-black text-forest-800">
                ${Number(orderConfirmation.totalUSD).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/products"
              className="px-6 py-3 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              href="/admin/tasks"
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
            >
              View Operations Kanban
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-forest-50 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Discover our single-origin organic harvests and experience full farm-to-fork DPP traceability.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-2xl bg-forest-600 text-white text-xs font-bold hover:bg-forest-700 shadow-md transition-all"
        >
          Explore Harvest Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-forest-100 text-forest-800 border border-forest-200">
            Frictionless Commerce
          </span>
          <span className="text-xs text-slate-400">Zustand Client State</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Secure Order Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Guaranteed single-origin cold-chain delivery with verified Digital Product Passports.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customer & Shipping & Payment */}
        <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>1. Customer & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Shipping Street Address *
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>2. Select Payment Gateway</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('STRIPE')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'STRIPE'
                    ? 'border-forest-500 bg-forest-50/50 text-forest-900 ring-2 ring-forest-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-forest-600" />
                <span>Stripe / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('WISE')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'WISE'
                    ? 'border-forest-500 bg-forest-50/50 text-forest-900 ring-2 ring-forest-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-5 h-5 text-sky-600" />
                <span>Wise Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CRYPTO')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'CRYPTO'
                    ? 'border-forest-500 bg-forest-50/50 text-forest-900 ring-2 ring-forest-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>USDT / Crypto</span>
              </button>
            </div>

            {/* Mock Credit Card Fields */}
            {paymentMethod === 'STRIPE' && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-forest-600 hover:bg-forest-700 text-white font-extrabold text-sm shadow-xl shadow-forest-600/30 transition-all hover:scale-[1.01] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Executing Order Payment & Decrementing Inventory...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay & Confirm Order (${total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Right Side: Order Summary & Zustand Cart Sync */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Order Summary</h3>
              <span className="text-xs text-slate-500 font-semibold">{items.length} items</span>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex space-x-3">
                  <img
                    src={item.product.imageUrl || 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300'}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      ${Number(item.product.priceUSD).toFixed(2)} each
                    </p>

                    {item.product.batch && (
                      <Link
                        href={`/dpp/${item.product.batch.batchNumber}`}
                        className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md hover:bg-forest-100"
                      >
                        <QrCode className="w-3 h-3 text-forest-600" />
                        DPP: {item.product.batch.batchNumber}
                      </Link>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-500 hover:bg-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-500 hover:bg-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-800">
                        ${(Number(item.product.priceUSD) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-3 border-t border-slate-100 flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Try 'NOMINI15' or 'GREEN2026'"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-medium focus:ring-2 focus:ring-forest-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <p
                className={`text-[11px] font-semibold ${
                  promoMessage.isError ? 'text-rose-600' : 'text-forest-700'
                }`}
              >
                {promoMessage.text}
              </p>
            )}

            {/* Pricing Calculations */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-forest-700 font-bold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cold-Chain Carbon-Neutral Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount Due</span>
                <span className="text-forest-700 text-base">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
