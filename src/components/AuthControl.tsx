'use client'

import { useEffect } from 'react'

import useAuthStore from '@/store/authStore'

import { useRouter } from 'next/navigation'

export default function AuthControl() {
  const hydrate = useAuthStore(state => state.hydrate)
  const user    = useAuthStore(state => state.user)
  const router  = useRouter()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (!useAuthStore.getState().user) {
          router.replace('/auth')
        }
      }, 0)
    }
  }, [user, router])

  return null
}
