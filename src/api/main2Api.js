import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

// MAIN2-1: 여행 상세 조회(상단)
export const getTravel = (travelId) =>
  api.get(`/travels/${travelId}`)

// MAIN2-2-1: 1인당 예산, d-day, 카테고리별 지출 조회 
export const getExpensesByTravel = (travelId) =>
  api.get('/expenses', { params: { travelId } })

// MAIN2-2-2: 여행 예산,날짜 정보 수정
export const updateTravel = (travelId, data) =>
  api.put(`/travels/${travelId}`, data)

// MAIN2-3: 최근 지출 3건
export const getRecentExpenses = (travelId, limit = 3) =>
  api.get('/expenses', {
    params: { travelId, _sort: 'date', _order: 'desc', _limit: limit }
  })

// 카테고리 목록
// GET /categories → [{ id:"c1", name:"교통", icon:"🚌" }, ...]
export const getCategories = () =>
  api.get('/categories')