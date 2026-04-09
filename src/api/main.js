import axios from 'axios';

export const getTravelList = () => axios.get('/api/travels');
export const getTravelDetail = (id) => axios.get(`/api/travels/${id}`);
export const createTravel = (travel) => axios.post('/api/travels', travel);
export const deleteTravel = (id) => axios.delete(`/api/travels/${id}`);

// ✅ 이 한 줄만 추가
export const patchTravel = (id, data) => axios.patch(`/api/travels/${id}`, data);