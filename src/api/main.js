import axios from 'axios';

export const getTravelList = () => axios.get('/api/travels');
export const createTravel = (travel) => axios.post('/api/travels', travel);
export const deleteTravel = (id) => axios.delete(`/api/travels/${id}`);
