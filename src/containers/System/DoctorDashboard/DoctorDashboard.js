import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import DoctorDashboardService from '../../../services/doctorDashboardService';
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
    const [error, setError] = useState(null);
    
    const user = useSelector(state => state.user.userInfo);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                console.log('🔍 Fetching dashboard data for doctor:', user.id);
                
                const [statsRes, appointmentsRes, specialtiesRes] = await Promise.all([
                    DoctorDashboardService.getDoctorStats(user.id),
                    DoctorDashboardService.getRecentAppointments(user.id, 10),
                    DoctorDashboardService.getTopSpecialties(user.id)
                ]);

                console.log('📊 Stats response:', statsRes);
                console.log('📅 Appointments response:', appointmentsRes);
                console.log('🏥 Specialties response:', specialtiesRes);

                if (statsRes && statsRes.code === 0) {
                    setStats(statsRes.data);
                } else {
                    console.error('❌ Stats error:', statsRes);
                    setError('Không thể tải thống kê');
                }

                if (appointmentsRes && appointmentsRes.code === 0) {
                    setRecentAppointments(appointmentsRes.data);
                } else {
                    console.error('❌ Appointments error:', appointmentsRes);
                }

                if (specialtiesRes && specialtiesRes.code === 0) {
                    setTopSpecialties(specialtiesRes.data);
                } else {
                    console.error('❌ Specialties error:', specialtiesRes);
                }
            } catch (error) {
                console.error('❌ Error fetching dashboard data:', error);
                setError('Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
    }, [user?.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'S1': return '#28a745'; // Đã xác nhận
            case 'S2': return '#ffc107'; // Chờ xác nhận
            case 'S3': return '#17a2b8'; // Đã hoàn thành
            case 'S4': return '#dc3545'; // Đã hủy
            default: return '#6c757d';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'S1': return 'Đã xác nhận';
            case 'S2': return 'Chờ xác nhận';
            case 'S3': return 'Đã hoàn thành';
            case 'S4': return 'Đã hủy';
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

    if (error) {
        return (
            <div className="doctor-dashboard">
                <div className="error-container">
                    <div className="error-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Lỗi tải dữ liệu</h3>
                    <p>{error}</p>
                    <button 
                        className="retry-btn"
                        onClick={() => window.location.reload()}
                    >
                        <i className="fas fa-redo"></i>
                        Thử lại
                    </button>
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
                        {recentAppointments.length > 0 ? (
                            recentAppointments.map((appointment) => (
                                <div key={appointment.id} className="appointment-item">
                                    <div className="appointment-info">
                                        <h4 className="patient-name">{appointment.patientName}</h4>
                                        <p className="appointment-time">
                                            <i className="fas fa-clock"></i>
                                            {appointment.time}
                                        </p>
                                        <p className="appointment-date">
                                            <i className="fas fa-calendar"></i>
                                            {new Date(appointment.date).toLocaleDateString('vi-VN')}
                                        </p>
                                        {appointment.reason && (
                                            <p className="appointment-reason">
                                                <i className="fas fa-comment"></i>
                                                {appointment.reason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="appointment-status">
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(appointment.status) }}
                                        >
                                            {appointment.statusText || getStatusText(appointment.status)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">
                                <i className="fas fa-calendar-times"></i>
                                <p>Chưa có lịch hẹn nào</p>
                            </div>
                        )}
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