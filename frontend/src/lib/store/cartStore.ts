import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  couponCode: string | null;
  discountPercent: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

const STORAGE_KEY = 'nomini_cart';

const loadSavedCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isDrawerOpen: false,
  couponCode: null,
  discountPercent: 0,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = [...state.items];
        const newQty = updatedItems[existingIndex].quantity + quantity;
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: Math.min(newQty, product.stockQty),
        };
      } else {
        updatedItems = [
          ...state.items,
          { product, quantity: Math.min(quantity, product.stockQty) },
        ];
      }

      saveCart(updatedItems);
      return { items: updatedItems, isDrawerOpen: true };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updated = state.items.filter((item) => item.product.id !== productId);
      saveCart(updated);
      return { items: updated };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const updated = state.items.filter((item) => item.product.id !== productId);
        saveCart(updated);
        return { items: updated };
      }

      const updated = state.items.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity: Math.min(quantity, item.product.stockQty),
          };
        }
        return item;
      });

      saveCart(updated);
      return { items: updated };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [], couponCode: null, discountPercent: 0 });
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

  applyCoupon: (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'NOMINI15' || cleanCode === 'AGRITECH15') {
      set({ couponCode: cleanCode, discountPercent: 0.15 });
      return { success: true, message: '15% Discount coupon applied!' };
    }
    if (cleanCode === 'GREEN2026') {
      set({ couponCode: cleanCode, discountPercent: 0.2 });
      return { success: true, message: '20% Earth Month coupon applied!' };
    }
    return { success: false, message: 'Invalid coupon code' };
  },

  removeCoupon: () => set({ couponCode: null, discountPercent: 0 }),

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (total, item) => total + Number(item.product.priceUSD) * item.quantity,
      0,
    );
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 75 ? 0 : 7.99; // Free shipping over $75
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    return subtotal * get().discountPercent;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const discount = get().getDiscountAmount();
    const shipping = get().getShippingFee();
    return Math.max(0, subtotal - discount + shipping);
  },
}));
