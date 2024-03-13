// API
// ----------------------------------------------------------------------

// Base URL
export const HOST_API = 'http://43.136.232.116/'
import axios from 'axios';

// ----------------------------------------------------------------------

export const GAODE_API = {
    apiKey: '03eceb9420e057a98616285039c15367',
    apiAdmin: 'https://restapi.amap.com/v3/config/district',
    apiIP: 'https://restapi.amap.com/v3/ip?key='
};

// ----------------------------------------------------------------------

// 获取所有用户信息
export const fetchAllUsers = async () => {
    try {
        const url = `${HOST_API}users`;
        const response = await axios.get(url);
        return response.data; // 这将返回所有用户的信息列表
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};
