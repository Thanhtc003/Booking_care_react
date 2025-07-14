import axios from "../axios";

export const searchDoctors = (query) => {
    return axios.get(`/api/search/doctors?query=${encodeURIComponent(query)}`);
};

export const searchSpecialties = (query) => {
    return axios.get(`/api/search/specialties?query=${encodeURIComponent(query)}`);
};

export const searchAll = (query) => {
    return axios.get(`/api/search/all?query=${encodeURIComponent(query)}`);
}; 