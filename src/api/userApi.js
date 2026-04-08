import apiClient from './client';

export const checkDuplicateEmail = (email) =>
  apiClient.get('/api/users', { params: { email } });

export const signup = (payload) => apiClient.post('/api/users', payload);

export const updateMyInfo = (payload) => apiClient.patch('/api/users', payload);

export const deleteMyAccount = () => apiClient.delete('/api/users');
