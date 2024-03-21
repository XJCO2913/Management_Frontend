// apis/index.js
import axios from 'axios';

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/api';

export const apiInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTEwNzM2MjksImlzQWRtaW4iOnRydWUsInVzZXJJRCI6IjEyMzEyMzEyMyJ9.8Bb3y3PNz0xdTCfBT3A0ph7L3m1A0cRfw3RA0k5Rgbw'}`, 
  }
});

export const userEndpoints = {
  fetchAllUsers: '/users',
  deleteUserById: (userId) => `/user?userID=${userId}`,
  deleteUserByIds: (userIdsString) => `/user?userID=${userIdsString}`,
  banUserById: (userId) => `/user/ban?userID=${userId}`,
  unbanUserById: (userId) => `/user/unban?userID=${userId}`,
  banUserByIds: (userIdsString) => `/user/ban?userID=${userIdsString}`,
  unbanUserByIds: (userIdsString) => `/user/unban?userID=${userIdsString}`,
};
