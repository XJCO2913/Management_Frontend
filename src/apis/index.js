// API
// ----------------------------------------------------------------------

// Base URL
export const HOST_API = 'http://43.136.232.116:5000/test';
import axios from 'axios';


// ----------------------------------------------------------------------

// 获取所有用户信息
export const fetchAllUsers = async (token) => {
    try {
        const url = `${HOST_API}/users`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch all users');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
};