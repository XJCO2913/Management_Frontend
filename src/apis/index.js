// apis/index.js
import axios from 'axios';

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/api';

const apiInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTEwMjYxOTcsImlzQWRtaW4iOnRydWUsInVzZXJJRCI6IjEyMzEyMzEyMyJ9.jTv3_Ke2xQSfRBTpvgCM_W9_6tTZWwBY5zgWC_JHrtk'}`, 
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

export const banUserById = async (userId) => {
  try {
    const response = await apiInstance.post(`/user/ban?userID=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error banning user:', error);
    throw error;
  }
};

export const unbanUserById = async (userId) => {
  try {
    const response = await apiInstance.post(`/user/unban?userID=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error unbanning user:', error);
    throw error;
  }
};