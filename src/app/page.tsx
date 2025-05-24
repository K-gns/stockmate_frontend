"use client"

import { useRouter } from 'next/navigation'

import useAuthStore from '@/store/authStore'

import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (user !== null) {
      router.replace('/home');
    } else {
      router.replace('/auth');
    }
  }, [user, router]);

  return null;
}
