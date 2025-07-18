import axios from '../axios';

export const getWebsiteRevenue = (timeRange = 'month') => {
    console.log('🌐 Calling getWebsiteRevenue with timeRange:', timeRange);
    return axios.get(`/api/revenue/website?timeRange=${timeRange}`);
};

export const getAllDoctorsRevenue = (timeRange = 'month') => {
    console.log('👨‍⚕️ Calling getAllDoctorsRevenue with timeRange:', timeRange);
    return axios.get(`/api/revenue/doctors?timeRange=${timeRange}`);
};

export const getDoctorRevenue = (doctorId, timeRange = 'month') => {
    console.log('👨‍⚕️ Calling getDoctorRevenue with doctorId:', doctorId, 'timeRange:', timeRange);
    return axios.get(`/api/revenue/doctors/${doctorId}?timeRange=${timeRange}`);
}; 