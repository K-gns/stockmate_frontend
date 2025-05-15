"use client"

import { useRouter } from 'next/navigation'

import useAuthStore from '@/store/authStore'

export default function Page() {
  const router = useRouter()
  const { user } = useAuthStore()

  if (user !== null) {
    router.push('/home')
  } else {
    router.push('/auth')
  }

  return null;
}
