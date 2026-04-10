import apiClient from './client';

// 전체 유저 가져온 뒤 travelId로 필터링
export const getMembersByTravelId = async (travelId) => {
  const res = await apiClient.get('/users');
  return res.data.filter(user => user.joinTravelIds.includes(travelId));
};
