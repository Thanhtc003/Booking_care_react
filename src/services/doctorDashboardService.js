import axios from '../axios';

class DoctorDashboardService {
    // Lấy thống kê tổng quan cho bác sĩ
    static async getDoctorStats(doctorId) {
        try {
            const response = await axios.get(`/api/doctor-dashboard/stats/${doctorId}`);
            console.log('🔍 Raw stats response:', response);
            
            // Kiểm tra nếu response.data có code property
            if (response.data && typeof response.data === 'object' && 'code' in response.data) {
                return response.data;
            } else {
                // Nếu không có code, wrap data vào format chuẩn
                return {
                    code: 0,
                    message: 'Thành công',
                    data: response.data
                };
            }
        } catch (error) {
            console.error('Error fetching doctor stats:', error);
            return {
                code: -1,
                message: 'Có lỗi xảy ra',
                data: null
            };
        }
    }

    // Lấy lịch hẹn gần đây
    static async getRecentAppointments(doctorId, limit = 10) {
        try {
            const response = await axios.get(`/api/doctor-dashboard/recent-appointments/${doctorId}?limit=${limit}`);
            console.log('🔍 Raw appointments response:', response);
            
            // Kiểm tra nếu response.data có code property
            if (response.data && typeof response.data === 'object' && 'code' in response.data) {
                return response.data;
            } else {
                // Nếu không có code, wrap data vào format chuẩn
                return {
                    code: 0,
                    message: 'Thành công',
                    data: response.data
                };
            }
        } catch (error) {
            console.error('Error fetching recent appointments:', error);
            return {
                code: -1,
                message: 'Có lỗi xảy ra',
                data: null
            };
        }
    }

    // Lấy thống kê chuyên khoa
    static async getTopSpecialties(doctorId) {
        try {
            const response = await axios.get(`/api/doctor-dashboard/top-specialties/${doctorId}`);
            console.log('🔍 Raw specialties response:', response);
            
            // Kiểm tra nếu response.data có code property
            if (response.data && typeof response.data === 'object' && 'code' in response.data) {
                return response.data;
            } else {
                // Nếu không có code, wrap data vào format chuẩn
                return {
                    code: 0,
                    message: 'Thành công',
                    data: response.data
                };
            }
        } catch (error) {
            console.error('Error fetching top specialties:', error);
            return {
                code: -1,
                message: 'Có lỗi xảy ra',
                data: null
            };
        }
    }
}

export default DoctorDashboardService; 