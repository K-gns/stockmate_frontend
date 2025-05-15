import { create } from 'zustand'

export type RequestData = {
  avatarSrc?: string
  name: string
  username: string
  email: string
  department: string
  material: string
  description: string
  quantity: number
  status: string
  statusColor: string
}

type RequestStore = {
  selectedRequest: RequestData | null
  setSelectedRequest: (request: RequestData) => void
  clearSelectedRequest: () => void
}

export const useSelectedRequestStore = create<RequestStore>((set) => ({
  selectedRequest: null,
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  clearSelectedRequest: () => set({ selectedRequest: null })
}))
