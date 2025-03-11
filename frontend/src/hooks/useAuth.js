import { create } from 'zustand';
import axios from 'axios';
import logger from '../utils/logger';

// Используем относительный путь, чтобы запросы шли через Vite Proxy
const API_URL = '/api';

// Функция для установки токена в Axios
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Устанавливаем токен при загрузке приложения (если есть)
const storedToken = localStorage.getItem('token');
setAuthToken(storedToken);

export const useAuth = create((set) => ({
  user: null,
  isAuthenticated: !!storedToken, // Если токен есть в localStorage, считаем юзера аутентифицированным
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      logger.auth('Attempting login...');

      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, ...user } = response.data;

      localStorage.setItem('token', token);
      setAuthToken(token);

      set({ user, isAuthenticated: true, isLoading: false, error: null });
      logger.auth('Login successful');
      return true;
    } catch (error) {
      logger.auth('Login failed:', error.message);
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      return false;
    }
  },

  register: async (username, email, password) => {
    try {
      set({ isLoading: true, error: null });
      logger.auth('Attempting registration...');

      const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      const { token, ...user } = response.data;

      localStorage.setItem('token', token);
      setAuthToken(token);

      set({ user, isAuthenticated: true, isLoading: false, error: null });
      logger.auth('Registration successful');
      return true;
    } catch (error) {
      logger.auth('Registration failed:', error.message);
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    set({ user: null, isAuthenticated: false, error: null });
    logger.auth('Logged out');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      setAuthToken(token);
      const response = await axios.get(`${API_URL}/auth/profile`);
      set({ user: response.data, isAuthenticated: true, error: null });
      logger.auth('Auth check successful');
    } catch (error) {
      logger.auth('Auth check failed:', error.message);
      localStorage.removeItem('token');
      setAuthToken(null);
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
