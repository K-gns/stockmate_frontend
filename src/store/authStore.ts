import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: { name: string } | null
}

interface AuthActions {
  login: (user: { name: string }) => void
  logout: () => void
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (user) => {
    localStorage.setItem('user', user.name)
    set({
      isAuthenticated: true,
      user,
    })
  },

  logout: () =>{
    localStorage.removeItem('user')
    set({
      isAuthenticated: false,
      user: null,
    })
  },

}))

export default useAuthStore
