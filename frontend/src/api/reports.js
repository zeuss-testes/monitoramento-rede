import api from './client.js';

export const fetchOverview = (params = {}) => api.get('/reports/overview', { params }).then((res) => res.data);

export const fetchTrends = (params = {}) => api.get('/reports/trends', { params }).then((res) => res.data);

export const fetchNetwork = (params = {}) => api.get('/reports/network', { params }).then((res) => res.data);
