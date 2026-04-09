import axios from 'axios';

// axios 객체 선언
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// axios 객체 export
export const settApi = {
  // 1. SET-01 여행별 정산조회
  // GET /api/settlements?travelId='travel1'
  getSettByTravel: async (travelId) => {
    const res = await api.get(`/settlements`, {
      params: { travelId },
    });
    return res.data;
  },

  // 2. SET-02 초기 정산 데이터 생성
  // POST /api/settlements
  postSett: async (sett) => {
    const res = await api.post('/settlements', sett);
    return res.data;
  },

  // 3. SET-03 정산 상태 변경
  // PATCH /api/settlements/{settlementId}
  patchSettStatus: async (settId, status) => {
    const res = await api.patch(`/settlements/${settId}`, { status });
    return res.data;
  },
};