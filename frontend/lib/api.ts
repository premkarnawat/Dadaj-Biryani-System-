import axios from 'axios';
import { supabase } from './supabase';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Supabase JWT token to every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ---- API Functions ----

export const productsApi = {
  getAll: (params?: { category?: string; search?: string }) =>
    api.get('/products', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/products/${id}`).then((r) => r.data),
  getBestsellers: () => api.get('/products/bestsellers').then((r) => r.data),
};

export const categoriesApi = {
  getAll: () => api.get('/categories').then((r) => r.data),
};

export const ordersApi = {
  create: (data: unknown) => api.post('/order/create', data).then((r) => r.data),
  getById: (id: string) => api.get(`/order/${id}`).then((r) => r.data),
  getMyOrders: () => api.get('/order/my-orders').then((r) => r.data),
};

export const couponsApi = {
  apply: (code: string, orderTotal: number) =>
    api.post('/apply-coupon', { code, orderTotal }).then((r) => r.data),
};

export const addressesApi = {
  getAll: () => api.get('/addresses').then((r) => r.data),
  create: (data: unknown) => api.post('/addresses', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.put(`/addresses/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/addresses/${id}`).then((r) => r.data),
};

export const chatApi = {
  getMessages: () => api.get('/chat/messages').then((r) => r.data),
  sendMessage: (message: string) =>
    api.post('/chat/send', { message }).then((r) => r.data),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  getOrders: (params?: unknown) => api.get('/admin/orders', { params }).then((r) => r.data),
  updateOrderStatus: (id: string, status: string) =>
    api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data),
  createProduct: (data: unknown) => api.post('/admin/products', data).then((r) => r.data),
  updateProduct: (id: string, data: unknown) =>
    api.put(`/admin/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`).then((r) => r.data),
  createCoupon: (data: unknown) => api.post('/admin/coupons', data).then((r) => r.data),
  updateCoupon: (id: string, data: unknown) =>
    api.put(`/admin/coupons/${id}`, data).then((r) => r.data),
};
