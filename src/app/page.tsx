'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth';

export default function Root() {
  const router = useRouter();
  useEffect(() => {
    const user = getStoredUser();
    if (user) router.replace('/home');
    else router.replace('/login');
  }, [router]);
  return null;
}
