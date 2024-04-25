// apis/index.js
import axios from 'axios';

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/test';
export const TEST_HOST_API = 'http://43.136.232.116:5000/test'


export const apiInstance = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
});

apiInstance.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export const userEndpoints = {
  fetchAllUsers: `/users`,
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
  uploadAvatar:`/user/avatar`,
};

export const adminEndpoints = {
  auth:{
    login: `/admin/login`
  }
};

export const endpoints = {
  activity: {
    create: `/activity/create`,
    all: `/activity/all`,
    deleteById: (activityId) => `/activity?activityID=${activityId}`,
    getById: (activityId) => `/activity?activityID=${activityId}`,
  },
  overview: {
    tag: `/activity/tags`,
    count: `/activity/counts`,
    profit: (option) =>  `/activity/profit?option=${option}`,
  }
};