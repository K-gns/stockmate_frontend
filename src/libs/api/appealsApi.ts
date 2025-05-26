import type { AxiosInstance, AxiosResponse } from 'axios';
import { apiClient } from './authApi';
import {RequestType} from "@store/requestStore";
import {materialsMap, warehousesMap} from "@store/materialsNames";

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
  created_at: string;
}

export interface AnalysisRetrieve {
  id: number;
  title: string;
  data: AnalysisData;
}

export interface AnalysisResult {
  id: number
  result: {
    target_tb: string
    target_count: number
    message: string
    data: Record<string, any>[]
  }
  created_at: string
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

//Запрос создания
export interface CreateRequestParams {
  material_id: number;
  current_tb: string;
  target_count?: number;
  count_months?: number;
  not_tb: string[];
  // следующие поля необязательны, для удобства можно переопределять
  left_file_path?: string;
  left_sheet_name?: string;
  consumption_file_path?: string;
  consumption_sheet_name?: string;
  consumption_tb_column_name?: string;
}




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
  create: async (
    params: CreateRequestParams
  ): Promise<RequestType> => {
    console.log("params in api", params)

    const data : any = {
          material_id: params.material_id,
          current_tb: params.current_tb,
          target_count: params.target_count,
          not_tb: params.not_tb.join(" "),
          left_file_path:             params.left_file_path             ?? '/app/data/ОСТАТКИ.XLSX',
          left_sheet_name:            params.left_sheet_name            ?? 'Sheet1',
          consumption_file_path:      params.consumption_file_path      ?? '/app/data/Потребление.XLSX',
          consumption_sheet_name:     params.consumption_sheet_name     ?? 'Sheet1',
          consumption_tb_column_name: params.consumption_tb_column_name ?? 'Завод',
    };

    if (typeof params.count_months === 'number') {
      // @ts-ignore
      data.count_months = params.count_months;
    } else {
      // @ts-ignore
      data.target_count = params.target_count ?? 0;
    }

    const payload = {
      analysis: { data }
    };

    console.log("CreateRequest payload:", payload)


    const resp: AxiosResponse<AppealRetrieve> = await apiClient.post(
      '/appeals/',
      payload
    );

    console.log("CreateRequest resp:", resp.data)


    return mapAppeal(resp.data);
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

  // Данные анализа
  const analysisData = a.analysis.data
  // Результат анализа
  // @ts-ignore
  const analysisResultData = a.analysis.result?.result

  const { data } = a?.analysis;
  const materialId = data.material_id;
  const materialName = materialsMap[materialId] ?? '';

  const current_tb = a.analysis.data.current_tb ?? '';
  const current_tb_name = warehousesMap[current_tb] ?? '';

  return {
    id:           a.id,
    author:         a?.author,
    material_id:     String(a.analysis.data.material_id),
    materialName,
    date:         new Date(a.created_at).toLocaleDateString('ru-RU'),
    target_count:        a.analysis.data.target_count ?? undefined,
    count_months: a.analysis.data.count_months ?? undefined,
    unit:         'шт',  // если всегда шт
    current_tb,
    current_tb_name,
    not_tb:       a.analysis.data.not_tb ? a.analysis.data.not_tb : [],
    comment:      undefined,
    status:       a.status?.name || "В работе",
    statusColor:  statusColorMap[a.status?.name || "В работе"],
    analysis: {
      // @ts-ignore
      data: analysisData,
      result: analysisResultData,
    },
  }
}

export default appealsApi;
