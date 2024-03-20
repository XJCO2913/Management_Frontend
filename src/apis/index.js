// apis/index.js
import axios from 'axios';

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/api';

export const apiInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTEwMjYxOTcsImlzQWRtaW4iOnRydWUsInVzZXJJRCI6IjEyMzEyMzEyMyJ9.jTv3_Ke2xQSfRBTpvgCM_W9_6tTZWwBY5zgWC_JHrtk'}`, 
  }
});

export const userEndpoints = {
  fetchAllUsers: '/users',
  deleteUserById: (userId) => `/user?userID=${userId}`,
  deleteUserByIds: (userIdsString) => `/user?userID=${userIdsString}`,
  banUserById: (userId) => `/user/ban?userID=${userId}`,
  unbanUserById: (userId) => `/user/unban?userID=${userId}`,
};