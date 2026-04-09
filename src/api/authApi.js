import apiClient from './client';

// AUTH-01 로그인(조회)
export const login = (payload) => apiClient.post('/login', payload);

// AUTH-02 로그아웃
export const logout = () => apiClient.post('/auth/logout');
