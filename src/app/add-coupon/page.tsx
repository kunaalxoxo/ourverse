'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The add-coupon page now redirects to home where the modal lives.
export default function AddCouponRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/home'); }, [router]);
  return null;
}
