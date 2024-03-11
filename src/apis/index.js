// API
// ----------------------------------------------------------------------

// Base URL
export const HOST_API = 'http://43.136.232.116/'

// ----------------------------------------------------------------------

export const GAODE_API = {
    apiKey: '03eceb9420e057a98616285039c15367',
    apiAdmin: 'https://restapi.amap.com/v3/config/district',
    apiIP: 'https://restapi.amap.com/v3/ip?key='
};

// ----------------------------------------------------------------------

// 获取用户信息
export const fetchUser = async (userId) => {
    try {
        const response = await axios.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};