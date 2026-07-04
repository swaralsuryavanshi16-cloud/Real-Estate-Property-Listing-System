import api from './axios';

export const getProperties = (params) => api.get('/properties', { params });
export const getProperty = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post('/properties', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
export const approveProperty = (id) => api.patch(`/properties/${id}/approve`);
export const deletePropertyImage = (id, filename) => api.delete(`/properties/${id}/images/${filename}`);
export const updateImageDetails = (id, filename, data) => api.patch(`/properties/${id}/images/${filename}`, data);
export const verifyDocuments = (id) => api.post(`/properties/${id}/documents/verify`);
