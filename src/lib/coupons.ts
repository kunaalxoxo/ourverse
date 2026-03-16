import { supabase } from './supabase';

export interface Coupon {
  id: string;
  from: string;
  to: string;
  name: string;
  description: string;
  deadline: string;
  image_url?: string;
  used: boolean;
  created_at: string;
}

export async function getCouponsForUser(username: string): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('to', username)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function addCoupon(
  coupon: Omit<Coupon, 'id' | 'used' | 'created_at'>
): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .insert([{ ...coupon, used: false }])
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function markCouponUsed(id: string): Promise<void> {
  const { error } = await supabase
    .from('coupons')
    .update({ used: true })
    .eq('id', id);
  if (error) console.error(error);
}

export function isCouponExpired(deadline: string): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}
