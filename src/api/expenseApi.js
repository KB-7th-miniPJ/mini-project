import apiClient from './client';

export const getExpenseList = (travelId) =>
  apiClient.get('/api/expenses', { params: { travelId } });

export const createExpense = (payload) =>
  apiClient.post('/api/expenses', payload);

export const updateExpense = (id, payload) =>
  apiClient.patch(`/api/expenses/${id}`, payload);

export const deleteExpense = (id) => apiClient.delete(`/api/expenses/${id}`);
