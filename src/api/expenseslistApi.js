import apiClient from './client';

// 지출 목록 전체 조회
export const getExpenses = (travelId) =>
  apiClient.get('/expenses', { params: { travelId } });

// 지출 수정
// PATCH /expenses/1
export const updateExpense = (expenseId, data) =>
  apiClient.put(`/expenses/${expenseId}`, data);

// 지출 삭제
// DELETE /expenses/1
export const deleteExpense = (expenseId) =>
  apiClient.delete(`/expenses/${expenseId}`);
