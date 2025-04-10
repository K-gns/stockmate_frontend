import { create } from 'zustand'

export interface RequestType {
  id: number;
  material: string;
  date: string;
  count: number;
  unit: string;
  bank: string;
  comment?: string;
  status: 'in_progress' | 'completed';
}

type RequestsState = {
  inProgressRequests: RequestType[];
  completedRequests: RequestType[];
};

type RequestsActions = {
  addRequest: (newRequest: Omit<RequestType, 'id' | 'date' | 'status'>) => void;
};

const useRequestsStore = create<RequestsState & RequestsActions>((set) => ({
  inProgressRequests: [
    { id: 1, material: 'Пакет п/э 200×300', date: '10.04.25', count: 20, unit: 'шт', bank: 'Отделение1', status: 'in_progress' },
    { id: 2, material: 'Пакет п/э 200×300', date: '10.04.25', count: 30, unit: 'шт', bank: 'Отделение2', status: 'in_progress' },
    { id: 3, material: 'Офисные стулья для айти-отдела главного офиса', date: '10.04.25', count: 45, unit: 'шт', bank: 'Отделение1', status: 'in_progress' },
  ],
  completedRequests: Array.from({ length: 18 }, (_, i) => ({
    id: 4 + i,
    material: i % 2 === 0 ? 'Пакет п/э 200×300' : 'Офисные стулья',
    date: `${7 + i}.04.25`,
    count: 15 + i * 3,
    unit: 'шт',
    bank: `Отделение${(i % 3) + 1}`,
    status: 'completed',
  })),

  addRequest: (newRequest) =>
    set((state) => ({
      inProgressRequests: [
        {
          id: Date.now(),
          ...newRequest,
          date: new Date().toLocaleDateString('ru-RU'),
          status: 'in_progress',
        },
        ...state.inProgressRequests,
      ],
  }))
}))

export default useRequestsStore
