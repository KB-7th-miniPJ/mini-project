import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// MAIN2-1: 여행 단건 조회
export const getTravel = (id) =>
  api.get(`/travels/${id}`)

// MAIN2-2-1: 지출 전체 조회
export const getExpensesByTravelId = (travelId) =>
  api.get('/expenses', { params: { travelId } })

// MAIN2-2-2: 여행 정보 수정 (예산, 날짜)
export const updateTravel = (id, data) =>
  api.patch(`/travels/${id}`, data)

// MAIN2-3: 최근 지출 3건
export const getRecentExpenses = (travelId, limit = 3) =>
  api.get('/expenses', {
    params: { travelId, _sort: 'date', _order: 'desc', _limit: limit }
  })

// 카테고리 목록
// GET /categories
export const getCategories = () =>
  api.get('/categories')