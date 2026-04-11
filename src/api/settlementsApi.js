// client.js 받아서 쓰는걸로 리폼
import apiClient from './client';

export const settApi = {
  // 1. SET-01 여행별 정산조회
  getSettByTravel: (travelId) =>
    apiClient.get(`/settlements`, { params: { travelId } }),

  // 2. SET-02 초기 정산 데이터 생성에 사용
  postSett: (sett) => apiClient.post('/settlements', sett),

  // 3. SET-03 정산 상태 변경
  patchSettStatus: (settId, status) =>
    apiClient.patch(`/settlements/${settId}`, { status }),
};
