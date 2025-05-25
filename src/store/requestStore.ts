import { create } from 'zustand'

// import { generateMockRequests, inProgressRequests } from '@/utils/mockRequests'
import appealsApi, {mapAppeal} from "@/libs/api/appealsApi";

export interface RequestType {
  id: number;
  material: string;
  materialName: string;
  date: string;
  count?: number;
  count_months?: number;
  unit: string;
  current_tb: string;
  not_tb?: string[];
  comment?: string;
  status: 'На уточнении' | 'В работе' | 'Выполнена' | 'Отменена';
  statusColor: 'pending' | 'inactive' | 'active' | 'cancelled' | 'completed';
}

type RequestsState = {
  inProgressRequests: RequestType[]
  completedRequests:  RequestType[]
  cancelledRequests:  RequestType[]
  loading:            boolean
  error:              string | null
}

type RequestsActions = {
  fetchAll:       () => Promise<void>
  addRequest:    (newRequest: Omit<RequestType, 'id' | 'date' | 'status' | 'statusColor'>) => void
  cancelRequest: (id: number) => Promise<void>
}

const useRequestsStore = create<RequestsState & RequestsActions>((set, get) => ({
  requests:           [],
  inProgressRequests: [],
  completedRequests:  [],
  cancelledRequests:  [],
  loading:            false,
  error:              null,

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const appeals = await appealsApi.list()
      const all = appeals.map(mapAppeal)

      set({
        inProgressRequests:  all.filter(r => r.status === 'В работе'),
        completedRequests:   all.filter(r => r.status === 'Выполнена'),
        cancelledRequests:   all.filter(r => r.status === 'Отменена'),
        loading:             false,
      })
    } catch (e: any) {
      set({ error: e.message, loading: false })
    }
  },

  addRequest: (newRequest) => {
    const id = Date.now()
    const date = new Date().toLocaleDateString('ru-RU')
    set(state => ({
      inProgressRequests: [
        {
          id,
          material: newRequest.material,
          materialName: newRequest.materialName,
          date,
          count: newRequest.count,
          count_months: newRequest.count_months,
          unit: newRequest.unit,
          current_tb: newRequest.current_tb,
          not_tb: newRequest.not_tb,
          comment: newRequest.comment,
          status: 'На уточнении',
          statusColor: 'pending',
        },
        ...state.inProgressRequests,
      ],
    }))
  },

  cancelRequest: async (id) =>
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
