// ============= Core Types =============

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'organizer';
  referralCode: string;
  points: number;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: EventCategory;
  location: string;
  venue: string;
  startDate: string;
  endDate: string;
  price: number; // 0 = free
  availableSeats: number;
  totalSeats: number;
  organizerId: string;
  organizer: Organizer;
  ticketTypes: TicketType[];
  vouchers: Voucher[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Organizer {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  rating: number;
  totalEvents: number;
  totalReviews: number;
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface Voucher {
  id: string;
  code: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  eventId: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountAmount: number;
  expiresAt: string;
  userId: string;
}

export interface Transaction {
  id: string;
  eventId: string;
  event: Event;
  userId: string;
  ticketTypeId: string;
  ticketType: TicketType;
  quantity: number;
  subtotal: number;
  voucherDiscount: number;
  couponDiscount: number;
  pointsUsed: number;
  finalPrice: number;
  status: TransactionStatus;
  paymentProof?: string;
  createdAt: string;
  expiresAt: string;
}

export type TransactionStatus = 
  | 'waiting_payment'
  | 'waiting_confirmation'
  | 'done'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PointHistory {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'used' | 'expired';
  description: string;
  createdAt: string;
  expiresAt?: string;
}

export type EventCategory = 
  | 'music'
  | 'business'
  | 'food'
  | 'health'
  | 'sports'
  | 'arts'
  | 'tech'
  | 'education'
  | 'community'
  | 'other';

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'music', label: 'Music & Concerts' },
  { value: 'business', label: 'Business & Professional' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'sports', label: 'Sports & Fitness' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'tech', label: 'Technology' },
  { value: 'education', label: 'Education' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' },
];

export const LOCATIONS = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bali',
  'Semarang',
  'Medan',
  'Makassar',
  'Online',
];

// ============= Utility Functions =============

export function formatCurrency(amount: number): string {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
}

export function getTransactionStatusLabel(status: TransactionStatus): string {
  const labels: Record<TransactionStatus, string> = {
    waiting_payment: 'Waiting for Payment',
    waiting_confirmation: 'Waiting for Confirmation',
    done: 'Completed',
    rejected: 'Rejected',
    expired: 'Expired',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

export function getTransactionStatusColor(status: TransactionStatus): string {
  const colors: Record<TransactionStatus, string> = {
    waiting_payment: 'warning',
    waiting_confirmation: 'info',
    done: 'success',
    rejected: 'destructive',
    expired: 'muted',
    cancelled: 'muted',
  };
  return colors[status];
}
