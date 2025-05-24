import { create } from 'zustand'

import authApi from '@/libs/api/authApi'

interface AuthState {
  isAuthenticated: boolean
  user: { email: string; access: string; refresh: string } | null
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  hydrate: () => void
}

const useAuthStore = create<AuthState & AuthActions>((set) => {

  return {
    isAuthenticated: false,
    user: null,

    hydrate: () => {
      if (typeof window === 'undefined') return
      const email   = localStorage.getItem('email')
      const access  = localStorage.getItem('token_access')
      const refresh = localStorage.getItem('token_refresh')

      if (email && access && refresh) {
        authApi.setAuthHeader(access)
        set({ isAuthenticated: true, user: { email, access, refresh } })
      }
    },

    login: async (email, password) => {
      const { access, refresh } = await authApi.login(email, password)

      // Сохраняем токены
      localStorage.setItem('token_access', access)
      localStorage.setItem('token_refresh', refresh)
      localStorage.setItem('email', email)

      // Устанавливаем заголовок для axios
      authApi.setAuthHeader(access)

      set({
        isAuthenticated: true,
        user: { email: email, access, refresh }
      })
    },

    logout: () => {
      localStorage.removeItem('token_access')
      localStorage.removeItem('token_refresh')
      localStorage.removeItem('user')

      authApi.clearAuthHeader()

      set({
        isAuthenticated: false,
        user: null
      })
    }
  }
})

export default useAuthStore
