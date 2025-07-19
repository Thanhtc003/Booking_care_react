import axios from 'axios';
// import _ from 'lodash';
// import config from './config';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    // withCredentials: true
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        console.log('=== AXIOS REQUEST ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method);
        console.log('Data:', config.data);
        console.log('Headers:', config.headers);
        
        // Add authorization header if token exists
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        
        return config;
    },
    (error) => {
        console.error('Axios request error:', error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        const { data } = response;
        console.log('=== AXIOS RESPONSE ===');
        console.log('Response data:', data);
        return data;
    },
    (error) => {
        // Handle error responses
        console.error('Axios error:', error);
        console.error('Error response:', error.response);
        return Promise.reject(error);
    }
);

export default instance;
