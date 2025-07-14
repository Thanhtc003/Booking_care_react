import axios from '../axios';

export const registerPatient = (data) => {
    return axios.post('api/auth/register/patient', data);
};

export const registerDoctor = (data) => {
    return axios.post('api/auth/register/doctor', data);
};

export const handleLogin = (email, password) => {
    return axios.post('api/auth/login', { email, password });
};

export const getPendingDoctorRequests = () => {
    return axios.get('api/auth/admin/doctor-requests');
};

export const approveDoctorRequest = (requestId, adminNote = '') => {
    console.log('=== SERVICE: approveDoctorRequest ===');
    console.log('Request ID:', requestId);
    console.log('Admin note:', adminNote);
    
    const result = axios.post('api/auth/admin/approve-doctor-request', { requestId, adminNote });
    console.log('=== SERVICE: axios call made ===');
    return result;
};

export const rejectDoctorRequest = (requestId, adminNote = '') => {
    return axios.post('api/auth/admin/reject-doctor-request', { requestId, adminNote });
}; 