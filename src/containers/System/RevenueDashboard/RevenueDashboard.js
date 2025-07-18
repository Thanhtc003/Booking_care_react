import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getWebsiteRevenue, getAllDoctorsRevenue, getDoctorRevenue } from '../../../services/revenueService';
import './RevenueDashboard.scss';

function RevenueDashboard() {
    const [websiteRevenue, setWebsiteRevenue] = useState(null);
    const [doctorsRevenue, setDoctorsRevenue] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorDetail, setDoctorDetail] = useState(null);
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'doctors'

    const user = useSelector(state => state.user.userInfo);

    useEffect(() => {
        fetchRevenueData();
    }, [timeRange]);

    const fetchRevenueData = async () => {
        setLoading(true);
        try {
            console.log('🔍 Fetching revenue data for timeRange:', timeRange);
            
            const [websiteRes, doctorsRes] = await Promise.all([
                getWebsiteRevenue(timeRange),
                getAllDoctorsRevenue(timeRange)
            ]);

            console.log('📊 Website revenue response:', websiteRes);
            console.log('👨‍⚕️ Doctors revenue response:', doctorsRes);

            if (websiteRes && websiteRes.code === 0) {
                console.log('✅ Setting website revenue data:', websiteRes.data);
                setWebsiteRevenue(websiteRes.data);
            } else {
                console.log('❌ Website revenue response error:', websiteRes);
            }

            if (doctorsRes && doctorsRes.code === 0) {
                console.log('✅ Setting doctors revenue data:', doctorsRes.data.doctors);
                setDoctorsRevenue(doctorsRes.data.doctors);
            } else {
                console.log('❌ Doctors revenue response error:', doctorsRes);
            }
        } catch (error) {
            console.error('❌ Error fetching revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDoctorClick = async (doctor) => {
        setSelectedDoctor(doctor);
        try {
            const response = await getDoctorRevenue(doctor.doctorId, timeRange);
            if (response && response.code === 0) {
                setDoctorDetail(response.data);
            }
        } catch (error) {
            console.error('Error fetching doctor revenue:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getTimeRangeText = () => {
        switch (timeRange) {
            case 'all': return 'Tất cả';
            case 'today': return 'Hôm nay';
            case 'week': return 'Tuần này';
            case 'month': return 'Tháng này';
            case 'year': return 'Năm nay';
            default: return 'Tháng này';
        }
    };

    if (loading) {
        return (
            <div className="revenue-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu doanh thu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="revenue-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    <FormattedMessage id="revenue.dashboard.title" defaultMessage="Quản lý Doanh thu" />
                </h1>
                <p className="dashboard-subtitle">
                    Chào mừng trở lại, {user?.firstName} {user?.lastName}!
                </p>
            </div>

            {/* Time Range Selector */}
            <div className="time-range-selector">
                <label>Khoảng thời gian:</label>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                </select>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <i className="fas fa-chart-line"></i>
                    Tổng quan
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('doctors')}
                >
                    <i className="fas fa-user-md"></i>
                    Doanh thu bác sĩ
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="overview-content">
                    {/* Summary Cards */}
                    <div className="summary-cards">
                        <div className="summary-card">
                            <div className="card-icon">
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <div className="card-content">
                                <h3>Tổng doanh thu {getTimeRangeText()}</h3>
                                <p className="card-value">{websiteRevenue ? formatCurrency(websiteRevenue.totalRevenue) : formatCurrency(0)}</p>
                                <span className="card-label">VND</span>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="card-icon">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div className="card-content">
                                <h3>Tổng lịch hẹn</h3>
                                <p className="card-value">{websiteRevenue ? websiteRevenue.totalAppointments : 0}</p>
                                <span className="card-label">Cuộc hẹn</span>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="card-icon">
                                <i className="fas fa-user-md"></i>
                            </div>
                            <div className="card-content">
                                <h3>Bác sĩ hoạt động</h3>
                                <p className="card-value">{websiteRevenue ? websiteRevenue.doctorRevenue.length : 0}</p>
                                <span className="card-label">Bác sĩ</span>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="card-icon">
                                <i className="fas fa-chart-bar"></i>
                            </div>
                            <div className="card-content">
                                <h3>Doanh thu trung bình</h3>
                                <p className="card-value">
                                    {websiteRevenue && websiteRevenue.totalAppointments > 0 
                                        ? formatCurrency(Math.round(websiteRevenue.totalRevenue / websiteRevenue.totalAppointments))
                                        : formatCurrency(0)
                                    }
                                </p>
                                <span className="card-label">VND/lịch hẹn</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Doctors Chart */}
                    <div className="chart-section">
                        <h3 className="chart-title">
                            <i className="fas fa-trophy"></i>
                            Top bác sĩ có doanh thu cao nhất
                        </h3>
                        <div className="doctors-chart">
                            {websiteRevenue && websiteRevenue.doctorRevenue && websiteRevenue.doctorRevenue.length > 0 ? (
                                websiteRevenue.doctorRevenue.slice(0, 10).map((doctor, index) => (
                                    <div key={index} className="doctor-chart-item">
                                        <div className="doctor-info">
                                            <span className="rank">#{index + 1}</span>
                                            <span className="doctor-name">{doctor.name}</span>
                                            <span className="appointments">{doctor.appointments} lịch hẹn</span>
                                        </div>
                                        <div className="revenue-bar">
                                            <div 
                                                className="revenue-progress" 
                                                style={{ 
                                                    width: `${(doctor.revenue / websiteRevenue.doctorRevenue[0].revenue) * 100}%` 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="revenue-value">{formatCurrency(doctor.revenue)}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">
                                    <p>Không có dữ liệu doanh thu trong khoảng thời gian này</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Daily Revenue Chart */}
                    <div className="chart-section">
                        <h3 className="chart-title">
                            <i className="fas fa-calendar-day"></i>
                            Doanh thu theo ngày
                        </h3>
                        <div className="daily-chart">
                            {websiteRevenue && websiteRevenue.dailyRevenue && websiteRevenue.dailyRevenue.length > 0 ? (
                                websiteRevenue.dailyRevenue.map((day, index) => (
                                    <div key={index} className="day-chart-item">
                                        <div className="day-info">
                                            <span className="day-date">{formatDate(day.date)}</span>
                                            <span className="day-revenue">{formatCurrency(day.revenue)}</span>
                                        </div>
                                        <div className="day-bar">
                                            <div 
                                                className="day-progress" 
                                                style={{ 
                                                    width: `${(day.revenue / Math.max(...websiteRevenue.dailyRevenue.map(d => d.revenue))) * 100}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">
                                    <p>Không có dữ liệu doanh thu theo ngày</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
                <div className="doctors-content">
                    <div className="doctors-grid">
                        {doctorsRevenue && doctorsRevenue.length > 0 ? (
                            doctorsRevenue.map((doctor, index) => (
                                <div 
                                    key={doctor.doctorId} 
                                    className={`doctor-card ${selectedDoctor?.doctorId === doctor.doctorId ? 'selected' : ''}`}
                                    onClick={() => handleDoctorClick(doctor)}
                                >
                                    <div className="doctor-avatar">
                                        {doctor.image ? (
                                            <img src={doctor.image} alt={doctor.name} />
                                        ) : (
                                            <i className="fas fa-user-md"></i>
                                        )}
                                    </div>
                                    <div className="doctor-info">
                                        <h4 className="doctor-name">{doctor.name}</h4>
                                        <p className="doctor-revenue">{formatCurrency(doctor.revenue)}</p>
                                        <p className="doctor-appointments">{doctor.appointments} lịch hẹn</p>
                                        <p className="doctor-average">
                                            Trung bình: {formatCurrency(doctor.averageRevenue)}/lịch hẹn
                                        </p>
                                    </div>
                                    <div className="doctor-rank">
                                        <span className="rank-number">#{index + 1}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">
                                <p>Không có dữ liệu doanh thu bác sĩ trong khoảng thời gian này</p>
                            </div>
                        )}
                    </div>

                    {/* Doctor Detail Modal */}
                    {selectedDoctor && doctorDetail && (
                        <div className="doctor-detail-modal">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>Chi tiết doanh thu - {selectedDoctor.name}</h3>
                                    <button 
                                        className="close-btn"
                                        onClick={() => {
                                            setSelectedDoctor(null);
                                            setDoctorDetail(null);
                                        }}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                
                                <div className="modal-body">
                                    <div className="detail-summary">
                                        <div className="detail-card">
                                            <h4>Tổng doanh thu</h4>
                                            <p>{formatCurrency(doctorDetail.totalRevenue)}</p>
                                        </div>
                                        <div className="detail-card">
                                            <h4>Tổng lịch hẹn</h4>
                                            <p>{doctorDetail.totalAppointments}</p>
                                        </div>
                                        <div className="detail-card">
                                            <h4>Doanh thu trung bình</h4>
                                            <p>
                                                {doctorDetail.totalAppointments > 0 
                                                    ? formatCurrency(Math.round(doctorDetail.totalRevenue / doctorDetail.totalAppointments))
                                                    : formatCurrency(0)
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="detail-charts">
                                        <div className="detail-chart">
                                            <h4>Doanh thu theo ngày</h4>
                                            <div className="daily-detail-chart">
                                                {doctorDetail.dailyRevenue.map((day, index) => (
                                                    <div key={index} className="day-detail-item">
                                                        <span className="day-date">{formatDate(day.date)}</span>
                                                        <div className="day-detail-bar">
                                                            <div 
                                                                className="day-detail-progress" 
                                                                style={{ 
                                                                    width: `${(day.revenue / Math.max(...doctorDetail.dailyRevenue.map(d => d.revenue))) * 100}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="day-revenue">{formatCurrency(day.revenue)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="detail-chart">
                                            <h4>Top bệnh nhân</h4>
                                            <div className="patients-chart">
                                                {doctorDetail.patientRevenue.slice(0, 10).map((patient, index) => (
                                                    <div key={index} className="patient-chart-item">
                                                        <div className="patient-info">
                                                            <span className="patient-name">{patient.name}</span>
                                                            <span className="patient-appointments">{patient.appointments} lịch hẹn</span>
                                                        </div>
                                                        <div className="patient-revenue-bar">
                                                            <div 
                                                                className="patient-revenue-progress" 
                                                                style={{ 
                                                                    width: `${(patient.revenue / doctorDetail.patientRevenue[0].revenue) * 100}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="patient-revenue">{formatCurrency(patient.revenue)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RevenueDashboard; 