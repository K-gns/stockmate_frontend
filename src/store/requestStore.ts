"use client"

import { create } from 'zustand'

import appealsApi, {AnalysisResult, CreateRequestParams, mapAppeal, UserSummary} from "@/libs/api/appealsApi";
import {toast} from "react-toastify";
import {materialsMap, warehousesMap} from "@store/materialsNames";

export interface RequestType {
  id: number;
  material_id: string;
  materialName: string;
  date: string;
  target_count?: number;
  count_months?: number;
  unit: string;
  current_tb: string;
  current_tb_name: string;
  not_tb?: string[];
  comment?: string;
  status: 'На уточнении' | 'В работе' | 'Выполнена' | 'Отменена';
  statusColor: 'pending' | 'inactive' | 'active' | 'cancelled' | 'completed';
  author?: UserSummary;
  analysis?: AnalysisResult;

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
  createRequest:    (newRequest: CreateRequestParams) => Promise<RequestType>
  addRequest:    (params: CreateRequestParams & { comment?: string }) => void
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

  createRequest: async (params: CreateRequestParams): Promise<RequestType> => {
    set({ loading: true, error: null })
    try {
      const newRequest = await appealsApi.create(params)
      set(state => ({
        inProgressRequests: [newRequest, ...state.inProgressRequests],
        loading: false
      }))
      toast.success('Заявка успешно создана')
      return newRequest
    } catch (e: any) {
      const message = e.response?.data?.detail || e.message || 'Неизвестная ошибка'
      set({ error: message, loading: false })
      console.error('createRequest error:', e)
      toast.error(`Не удалось создать заявку: ${message}`)
      throw e
    } finally {
      set({ loading: false })
    }
  },

  addRequest: (params: CreateRequestParams & { comment?: string }) => {
    const id = Date.now()
    const date = new Date().toLocaleDateString('ru-RU')
    const materialIdStr = String(params.material_id)


    const newReq: RequestType = {
      id,
      material_id:     materialIdStr,
      materialName:    materialsMap[params.material_id] ?? '',
      date,
      target_count:    params.target_count,
      count_months:    params.count_months,
      unit:            'шт',
      current_tb:      params.current_tb,
      current_tb_name: warehousesMap[params.current_tb] ?? '',
      not_tb:          params.not_tb,
      comment:         params.comment,
      status:          'На уточнении',
      statusColor:     'pending',
      author:          undefined,
    }

    set(state => ({
      inProgressRequests: [newReq, ...state.inProgressRequests]
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
