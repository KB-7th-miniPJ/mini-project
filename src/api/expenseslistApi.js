import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// EXPENSESLIST: 지출 목록 전체 조회
export const getExpenses = (travelId) =>
  api.get('/expenses', { params: { travelId } })

// EXP-04: 지출 수정
export const updateExpense = (expenseId, data) =>
  api.put(`/expenses/${expenseId}`, data)

// EXP-05: 지출 삭제
export const deleteExpense = (expenseId) =>
  api.delete(`/expenses/${expenseId}`)