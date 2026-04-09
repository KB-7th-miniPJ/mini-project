import apiClient from './client';

// TRAVEL-01 여행 목록 조회
export const getTravelList = () => apiClient.get('/travels');

// TRAVEL-02 여행 상세 조회
export const getTravelDetail = (id) => apiClient.get(`/travels/${id}`);

// TRAVEL-03 여행 상세 내역 수정
export const updateTravelDetail = (id, payload) =>
  apiClient.patch(`/travels/${id}`, payload);

// TRAVEL-04 여행 삭제
export const deleteTravel = (id) => apiClient.delete(`/travels/${id}`);
