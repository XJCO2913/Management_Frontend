// apis/index.js
import axios from 'axios';

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/api';

const apiInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTA3NTc0OTcsImlzQWRtaW4iOnRydWUsInVzZXJJRCI6IjEyMzEyMzEyMyJ9.UepFdD-7XwQJygtgPMTfteCACA4t0d09EZh8qM8wTPE'}`, // 将Token配置在这里
  }
});

export const fetchAllUsers = async () => {
  try {
    const response = await apiInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const response = await apiInstance.delete(`/user?userID=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const deleteUserByIds = async (userIdsString) => {
  try {
    const response = await apiInstance.delete(`/user?userID=${userIdsString}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting users:', error);
    throw error;
  }
};
