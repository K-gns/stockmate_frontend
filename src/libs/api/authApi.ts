import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

// Инстанс axios
const apiClient: AxiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Интерфейсы для ответов API
export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

const authApi = {
  /**
   * Авторизация пользователя
   * @returns токены доступа и обновления
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await apiClient.post('http://localhost:8000/api/v1/auth/token/', {
      email,
      password,
    });

    console.log(response)

    return response.data;
  },

  /**
   * Обновление access-токена по refresh
   */
  refreshToken: async (refresh: string): Promise<RefreshResponse> => {
    const response: AxiosResponse<RefreshResponse> = await apiClient.post('/auth/token/refresh/', {
      refresh,
    });

    return response.data;
  },

  /**
   * Устанавливает Authorization заголовок для последующих запросов
   */
  setAuthHeader: (token: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  /**
   * Очищает Authorization заголовок
   */
  clearAuthHeader: () => {
    delete apiClient.defaults.headers.common['Authorization'];
  },
};

export { apiClient, authApi };
export default authApi;
