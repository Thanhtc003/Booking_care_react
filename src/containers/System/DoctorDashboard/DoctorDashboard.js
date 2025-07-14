import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './DoctorDashboard.scss';

function DoctorDashboard() {
    const [stats, setStats] = useState({
        todayAppointments: 0,
        weekAppointments: 0,
        monthAppointments: 0,
        totalPatients: 0,
        averageRating: 4.5,
        monthlyIncome: 0
    });
    
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [topSpecialties, setTopSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const user = useSelector(state => state.user.userInfo);

    useEffect(() => {
        // Simulate fetching dashboard data
        const fetchDashboardData = async () => {
            setLoading(true);
            
            // Mock data - in real app, these would be API calls
            setTimeout(() => {
                setStats({
                    todayAppointments: 8,
                    weekAppointments: 45,
                    monthAppointments: 180,
                    totalPatients: 156,
                    averageRating: 4.7,
                    monthlyIncome: 25000000
                });
                
                setRecentAppointments([
                    { id: 1, patientName: 'Nguyễn Văn A', time: '09:00', status: 'confirmed', specialty: 'Tim mạch' },
                    { id: 2, patientName: 'Trần Thị B', time: '10:30', status: 'pending', specialty: 'Da liễu' },
                    { id: 3, patientName: 'Lê Văn C', time: '14:00', status: 'completed', specialty: 'Nội khoa' },
                    { id: 4, patientName: 'Phạm Thị D', time: '15:30', status: 'confirmed', specialty: 'Nhi khoa' }
                ]);
                
                setTopSpecialties([
                    { name: 'Tim mạch', count: 45, percentage: 25 },
                    { name: 'Da liễu', count: 38, percentage: 21 },
                    { name: 'Nội khoa', count: 32, percentage: 18 },
                    { name: 'Nhi khoa', count: 28, percentage: 16 },
                    { name: 'Thần kinh', count: 22, percentage: 12 }
                ]);
                
                setLoading(false);
            }, 1000);
        };
        
        fetchDashboardData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#28a745';
            case 'pending': return '#ffc107';
            case 'completed': return '#17a2b8';
            case 'cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xác nhận';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="doctor-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    <FormattedMessage id="doctor.dashboard.title" defaultMessage="Bảng điều khiển" />
                </h1>
                <p className="dashboard-subtitle">
                    Chào mừng trở lại, {user?.firstName} {user?.lastName}!
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Hôm nay</h3>
                        <p className="stat-number">{stats.todayAppointments}</p>
                        <span className="stat-label">Lịch hẹn</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-calendar-week"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Tuần này</h3>
                        <p className="stat-number">{stats.weekAppointments}</p>
                        <span className="stat-label">Lịch hẹn</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Tổng bệnh nhân</h3>
                        <p className="stat-number">{stats.totalPatients}</p>
                        <span className="stat-label">Người</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Đánh giá</h3>
                        <p className="stat-number">{stats.averageRating}</p>
                        <span className="stat-label">Sao trung bình</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Thu nhập tháng</h3>
                        <p className="stat-number">{formatCurrency(stats.monthlyIncome)}</p>
                        <span className="stat-label">VND</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Tháng này</h3>
                        <p className="stat-number">{stats.monthAppointments}</p>
                        <span className="stat-label">Lịch hẹn</span>
                    </div>
                </div>
            </div>

            {/* Charts and Analytics */}
            <div className="analytics-grid">
                {/* Top Specialties Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">
                        <i className="fas fa-chart-pie"></i>
                        Chuyên khoa được khám nhiều nhất
                    </h3>
                    <div className="specialties-list">
                        {topSpecialties.map((specialty, index) => (
                            <div key={index} className="specialty-item">
                                <div className="specialty-info">
                                    <span className="specialty-name">{specialty.name}</span>
                                    <span className="specialty-count">{specialty.count} bệnh nhân</span>
                                </div>
                                <div className="specialty-bar">
                                    <div 
                                        className="specialty-progress" 
                                        style={{ width: `${specialty.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="specialty-percentage">{specialty.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="chart-card">
                    <h3 className="chart-title">
                        <i className="fas fa-clock"></i>
                        Lịch hẹn gần đây
                    </h3>
                    <div className="appointments-list">
                        {recentAppointments.map((appointment) => (
                            <div key={appointment.id} className="appointment-item">
                                <div className="appointment-info">
                                    <h4 className="patient-name">{appointment.patientName}</h4>
                                    <p className="appointment-time">
                                        <i className="fas fa-clock"></i>
                                        {appointment.time}
                                    </p>
                                    <p className="appointment-specialty">
                                        <i className="fas fa-stethoscope"></i>
                                        {appointment.specialty}
                                    </p>
                                </div>
                                <div className="appointment-status">
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                                    >
                                        {getStatusText(appointment.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3 className="actions-title">
                    <i className="fas fa-bolt"></i>
                    Thao tác nhanh
                </h3>
                <div className="actions-grid">
                    <button className="action-btn">
                        <i className="fas fa-calendar-plus"></i>
                        Tạo lịch khám
                    </button>
                    <button className="action-btn">
                        <i className="fas fa-user-plus"></i>
                        Thêm bệnh nhân
                    </button>
                    <button className="action-btn">
                        <i className="fas fa-file-medical"></i>
                        Xem hồ sơ
                    </button>
                    <button className="action-btn">
                        <i className="fas fa-chart-bar"></i>
                        Báo cáo chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard; 