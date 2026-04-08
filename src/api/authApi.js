import apiClient from './client';

export const login = (payload) => apiClient.post('/api/auth/login', payload);

export const logout = () => apiClient.post('/api/auth/logout');
