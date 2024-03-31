// apis/index.js
import axios from 'axios';

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/test';

export const apiInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTE5NzcxMjQsImlzQWRtaW4iOnRydWUsInVzZXJJRCI6IjEyMzEyMzEyMyJ9.HDWb49tJJhs5qlE1c_k9WUUoNEIqtONk_D1fR3vvg0M'}`, 
  }
});

export const userEndpoints = {
  fetchAllUsers: '/users',
  fetchUserById: (userId) => `/user?userID=${userId}`,
  deleteUserById: (userId) => `/user?userID=${userId}`,
  deleteUserByIds: (userIdsString) => `/user?userID=${userIdsString}`,
  banUserById: (userId) => `/user/ban?userID=${userId}`,
  unbanUserById: (userId) => `/user/unban?userID=${userId}`,
  banUserByIds: (userIdsString) => `/user/ban?userID=${userIdsString}`,
  unbanUserByIds: (userIdsString) => `/user/unban?userID=${userIdsString}`,
  checkUserStatusById: (userId) => `/user/status?userID=${userId}`,
  AllUserStatus: `/user/statuses`,
  editUserById: (userId, userData) => ({
    url: `/user?userID=${userId}`,
    method: 'patch',
    data: userData,
  }),
};
