import type {AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import useAuthStore from "@store/authStore";
import {toast} from "react-toastify";

// Инстанс axios
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://188.92.28.153/api/v1' || '/api/v1',
  // baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

//Разлогин при 401 forbidden с сервера
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // разлогиним пользователя
      const logout = useAuthStore.getState().logout;
      logout();
    } else {
      toast.error(`Не удалось выполнить запрос: ${error.response?.status}`)
    }
    return Promise.reject(error);
  }
);

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
    const response: AxiosResponse<LoginResponse> = await apiClient.post('/auth/token/', {
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
