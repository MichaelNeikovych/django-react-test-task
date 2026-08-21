import api from './axios';

export const loginApi = async (username, password) => {
  const response = await api.post('/auth/login/', {
    username,
    password,
  });

  return response.data;
};

export const currentUserApi = async () => {
  const response = await api.get('/auth/me/');

  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout/');

  return response.data;
};