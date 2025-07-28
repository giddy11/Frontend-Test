import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

// Replace with actual JWT token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYwYWFhMGMxLTFjZDctNDg0Ni05MjVjLWVmNTdmYzc4NTMyYyIsImVtYWlsIjoiZWRvZ2hvdHVnaWRkeSs1QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUyOTU3OTc5LCJleHAiOjE3NjE1OTc5Nzl9.EYybkI2PTzMKSNDA1Z1FVpeMRSxrtoL6hUXK9oe_NVs'; // TODO: Implement auth flow
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// const token = localStorage.getItem('jwtToken');
// api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const fetchNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const fetchCommunityNotifications = async (communityId) => {
  const response = await api.get(`/api/communities/${communityId}/notifications`);
  return response.data;
};

export const sendTestNotification = async (payload) => {
  await api.post('/api/notification/test', payload);
};

export const markNotificationAsRead = async (notificationId) => {
  await api.put(`/api/notifications/${notificationId}/read`);
};