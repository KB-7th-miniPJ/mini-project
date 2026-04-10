import apiClient from './client';

// EXP-007: 카테고리 목록 조회
export const getCategories = () =>
  apiClient.get('/categories');

// EXP-001: 지출 기록 생성
export const createExpense = (data) =>
  apiClient.post('/expenses', data);

// EXP-006: 영수증 이미지 업로드
export const uploadReceipt = (expenseId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post(`/expenses/${expenseId}/receipt`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
