import { create } from 'zustand'

import { generateMockRequests, inProgressRequests } from '@/utils/mockRequests'

export interface RequestType {
  id: number;
  material: string;
  date: string;
  count?: number;
  count_months?: number;
  unit: string;
  current_tb: string;
  not_tb?: string[];
  comment?: string;
  status: 'На уточнении' | 'В работе' | 'Завершена' | 'Отменена';
  statusColor: 'pending' | 'inactive' | 'active' | 'cancelled' | 'completed';
}

type RequestsState = {
  inProgressRequests: RequestType[];
  completedRequests: RequestType[];
  cancelledRequests: RequestType[];
};

type RequestsActions = {
  addRequest: (newRequest: Omit<RequestType, 'id' | 'date' | 'status' | 'statusColor'>) => void;
  cancelRequest: (id: number) => void;
};

const useRequestsStore = create<RequestsState & RequestsActions>((set) => ({
  inProgressRequests: inProgressRequests,
  completedRequests: generateMockRequests(18),
  cancelledRequests: [],

  addRequest: (newRequest) =>
    set((state) => ({
      inProgressRequests: [
        {
          id: Date.now(),
          ...newRequest,
          date: new Date().toLocaleDateString('ru-RU'),
          status: 'На уточнении',
          statusColor: 'pending',
        },
        ...state.inProgressRequests,
      ],
    })),
  cancelRequest: (id) =>
    set((state) => {
      const target = state.inProgressRequests.find(r => r.id === id);

      if (!target) return state;

      return {
        inProgressRequests: state.inProgressRequests.filter(r => r.id !== id),
        cancelledRequests: [
          {
            ...target,
            status: 'Отменена',
            statusColor: 'cancelled',
          },
          ...state.cancelledRequests,
        ],
      };
    }),
}))

export default useRequestsStore
