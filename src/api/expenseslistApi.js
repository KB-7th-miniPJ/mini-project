import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// 지출 목록 전체 조회
export const getExpenses = (travelId) =>
  api.get('/expenses', { params: { travelId } })

// 지출 수정 // 이부분은 expenses 페이지 따와서 put할예정
// PATCH /expenses/1  (expenses.id = 1 숫자)
export const updateExpense = (expenseId, data) =>
  api.patch(`/expenses/${expenseId}`, data)

// 지출 삭제
// DELETE /expenses/1
export const deleteExpense = (expenseId) =>
  api.delete(`/expenses/${expenseId}`)