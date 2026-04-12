import apiClient from './client';

// USER-01 중복가입 조회(내정보)
export const checkDuplicateEmail = (email) =>
  apiClient.get('/users', { params: { email } });

// USER-02 회원가입
export const signup = (payload) => apiClient.post('/users', payload);

// USER-03 내정보 변경
export const updateMyInfo = (payload) => apiClient.patch('/users', payload);

// USER-06 특정 유저 정보 수정
export const patchUser = (id, payload) => apiClient.patch(`/users/${id}`, payload);

// USER-04 회원탈퇴
export const deleteMyAccount = () => apiClient.delete('/users');

// USER-05 유저전체조회
export const getUsers = () => apiClient.get('/users');


