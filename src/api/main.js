import axios from 'axios';

// TRAVEL-01 여행 목록 조회
export const getTravelList = () => axios.get('/api/travels');

// TRAVEL-02 여행 상세 조회
export const getTravelDetail = (id) => axios.get(`/api/travels/${id}`);

// TRAVEL-03 여행 생성
export const createTravel = (travel) => axios.post('/api/travels', travel);

// TRAVEL-04 여행 삭제
export const deleteTravel = (id) => axios.delete(`/api/travels/${id}`);

// TRAVEL-05 초대코드로 여행 조회
export const getTravelByInviteCode = (code) => axios.get('/api/travels', { params: { inviteCode: code } });

// TRAVEL-06 여행 인원 수 수정
export const TravelMembers = (id, membersCount) => axios.patch(`/api/travels/${id}`, { membersCount });
