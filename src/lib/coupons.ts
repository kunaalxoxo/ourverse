import { v4 as uuidv4 } from 'uuid';

export interface Coupon {
  id: string;
  from: string;
  to: string;
  name: string;
  description: string;
  deadline: string;
  imageUrl?: string;
  used: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'ourverse_coupons';

export function getCoupons(): Coupon[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getCouponsForUser(username: string): Coupon[] {
  return getCoupons().filter((c) => c.to === username);
}

export function addCoupon(coupon: Omit<Coupon, 'id' | 'used' | 'createdAt'>): Coupon {
  const newCoupon: Coupon = {
    ...coupon,
    id: uuidv4(),
    used: false,
    createdAt: new Date().toISOString(),
  };
  const all = getCoupons();
  all.push(newCoupon);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return newCoupon;
}

export function markCouponUsed(id: string): void {
  const all = getCoupons();
  const idx = all.findIndex((c) => c.id === id);
  if (idx !== -1) {
    all[idx].used = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

export function isCouponExpired(deadline: string): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}
