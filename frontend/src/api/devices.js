import api from './client.js';

export const listDevices = () => api.get('/devices').then((res) => res.data);

export const getDeviceUsage = (deviceId, params = {}) =>
  api.get(`/funcionarios/${deviceId}/usage`, { params }).then((res) => res.data);

export const getDeviceDetails = (deviceId) =>
  api.get(`/funcionarios/${deviceId}/details`).then((res) => res.data);

export const getDeviceHistory = (deviceId) =>
  api.get(`/funcionarios/${deviceId}/historico`).then((res) => res.data);

export const createDevice = (payload) => api.post('/devices', payload).then((res) => res.data);

export const updateDevice = (deviceId, payload) =>
  api.put(`/funcionarios/${deviceId}`, payload).then((res) => res.data);

export const deleteDevice = (deviceId) => api.delete(`/funcionarios/${deviceId}`).then((res) => res.data);
