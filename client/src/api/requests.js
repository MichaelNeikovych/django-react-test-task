import api from './axios';

export const fetchRequestsApi = async () => {
  const response = await api.get('/requests/');

  return response.data;
};

export const createRequestApi = async (data) => {
  const response = await api.post('/requests/', data);

  return response.data;
};