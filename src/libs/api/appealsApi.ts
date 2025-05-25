import type { AxiosInstance, AxiosResponse } from 'axios';
import { apiClient } from './authApi';
import {RequestType} from "@store/requestStore";
import {materialsMap} from "@store/materialsNames";

export interface UserSummary {
  username: string;
  email: string;
  is_staff: boolean;
}

export interface AnalysisData {
  id: number;
  material_id: number;
  current_tb: string | null;
  target_count: number;
  count_months: number;
  not_tb: string[];
  // ... остальные поля
  created_at: string;
}

export interface AnalysisRetrieve {
  id: number;
  title: string;
  data: AnalysisData;
}

export interface AnalysisResult {
  id: number;
  result: any;
  created_at: string;
}

export interface AppealStatusRetrieve {
  id: number;
  name: 'На уточнении' | 'В работе' | 'Выполнена' | 'Отменена';
}

export interface AppealRetrieve {
  id: number;
  title: string;
  author: UserSummary;
  analysis: AnalysisRetrieve;
  result: AnalysisResult;
  status: AppealStatusRetrieve;
  created_at: string;
  completed_at: string | null;
}

// --- Ответ при листинге ---
export type AppealsListResponse = AppealRetrieve[];



export const appealsApi = {
  /**
   * Получить список всех заявок
   */
  list: async (): Promise<AppealsListResponse> => {
    const resp: AxiosResponse<AppealsListResponse> = await apiClient.get('/appeals/');
    console.log(`list`, resp.data)

    return resp.data;
  },

  /**
   * Получить одну заявку по ID
   */
  retrieve: async (id: number): Promise<AppealRetrieve> => {
    const resp: AxiosResponse<AppealRetrieve> = await apiClient.get(`/appeals/${id}/`);
    return resp.data;
  },

  /**
   * Создать новую заявок
   */
  create: async (payload: Partial<AppealRetrieve>): Promise<AppealRetrieve> => {
    const resp: AxiosResponse<AppealRetrieve> = await apiClient.post('/appeals/', payload);

    console.log(resp)

    return resp.data;
  },

  /**
   * Обновить существующую апелляцию
   */
  update: async (id: number, payload: Partial<AppealRetrieve>): Promise<AppealRetrieve> => {
    const resp: AxiosResponse<AppealRetrieve> = await apiClient.put(`/appeals/${id}/`, payload);
    return resp.data;
  },

};

export const   mapAppeal = (a: AppealRetrieve): RequestType => {
  // определяем цвет по статусу
  const statusColorMap: Record<AppealRetrieve['status']['name'], RequestType['statusColor']> = {
    'На уточнении': 'pending',
    'В работе':      'pending',
    'Выполнена':     'completed',
    'Отменена':      'cancelled',
  }

  const { data } = a?.analysis;
  const materialId = data.material_id;
  const materialName = materialsMap[materialId] ?? '';

  return {
    id:           a.id,
    material:     String(a.analysis.data.material_id),
    materialName,
    date:         new Date(a.created_at).toLocaleDateString('ru-RU'),
    count:        a.analysis.data.target_count ?? undefined,
    count_months: a.analysis.data.count_months ?? undefined,
    unit:         'шт',  // если всегда шт
    current_tb:   a.analysis.data.current_tb ?? '',
    not_tb:       a.analysis.data.not_tb ? a.analysis.data.not_tb : [],
    comment:      undefined,
    status:       a.status?.name || "В работе",
    statusColor:  statusColorMap[a.status?.name || "В работе"],
  }
}

export default appealsApi;
