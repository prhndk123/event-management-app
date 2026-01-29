import { create } from 'zustand';
import { Event, TicketType, Voucher } from '~/types';

interface CartItem {
  event: Event;
  ticketType: TicketType;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  appliedVoucher: Voucher | null;
  appliedCouponCode: string | null;
  couponDiscount: number;
  pointsToUse: number;
  
  // Actions
  addItem: (event: Event, ticketType: TicketType, quantity: number) => void;
  removeItem: (ticketTypeId: string) => void;
  updateQuantity: (ticketTypeId: string, quantity: number) => void;
  clearCart: () => void;
  applyVoucher: (voucher: Voucher) => void;
  removeVoucher: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  setPointsToUse: (points: number) => void;
  getSubtotal: () => number;
  getVoucherDiscount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  appliedVoucher: null,
  appliedCouponCode: null,
  couponDiscount: 0,
  pointsToUse: 0,

  addItem: (event, ticketType, quantity) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        item => item.ticketType.id === ticketType.id
      );
      
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { items: newItems };
      }
      
      return { 
        items: [...state.items, { event, ticketType, quantity }],
        // Clear any previous vouchers since we're adding a new event
        appliedVoucher: null,
      };
    });
  },

  removeItem: (ticketTypeId) => {
    set((state) => ({
      items: state.items.filter(item => item.ticketType.id !== ticketTypeId)
    }));
  },

  updateQuantity: (ticketTypeId, quantity) => {
    set((state) => ({
      items: state.items.map(item =>
        item.ticketType.id === ticketTypeId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    }));
  },

  clearCart: () => {
    set({
      items: [],
      appliedVoucher: null,
      appliedCouponCode: null,
      couponDiscount: 0,
      pointsToUse: 0,
    });
  },

  applyVoucher: (voucher) => {
    set({ appliedVoucher: voucher });
  },

  removeVoucher: () => {
    set({ appliedVoucher: null });
  },

  applyCoupon: (code, discount) => {
    set({ appliedCouponCode: code, couponDiscount: discount });
  },

  removeCoupon: () => {
    set({ appliedCouponCode: null, couponDiscount: 0 });
  },

  setPointsToUse: (points) => {
    set({ pointsToUse: points });
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + (item.ticketType.price * item.quantity), 0);
  },

  getVoucherDiscount: () => {
    const { appliedVoucher } = get();
    const subtotal = get().getSubtotal();
    
    if (!appliedVoucher) return 0;
    
    if (appliedVoucher.discountType === 'percentage') {
      return Math.floor(subtotal * (appliedVoucher.discountAmount / 100));
    }
    
    return Math.min(appliedVoucher.discountAmount, subtotal);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const voucherDiscount = get().getVoucherDiscount();
    const { couponDiscount, pointsToUse } = get();
    
    return Math.max(0, subtotal - voucherDiscount - couponDiscount - pointsToUse);
  },
}));
