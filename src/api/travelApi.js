import apiClient from './client';

export const getTravelList = () => apiClient.get('/api/travels');

export const getTravelDetail = (id) => apiClient.get(`/api/travels/${id}`);

export const updateTravelDetail = (id, payload) =>
  apiClient.patch(`/api/travels/${id}`, payload);

export const deleteTravel = (id) => apiClient.delete(`/api/travels/${id}`);
