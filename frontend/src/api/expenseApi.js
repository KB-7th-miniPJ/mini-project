const BASE_URL = "/api";

// EXP-007: 카테고리 목록 조회
export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
};

// EXP-001: 지출 기록 생성
export const createExpense = async (data) => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// EXP-006: 영수증 이미지 업로드
export const uploadReceipt = async (expenseId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/expenses/${expenseId}/receipt`, {
    method: "POST",
    body: formData,
  });
  return res.json();
};