import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './AdminDashboard.scss';

function AdminDashboard({ userInfo }) {
    const history = useHistory();

    const adminFeatures = [
        {
            title: 'menu.admin.manage-admin',
            description: 'Quản lý tài khoản admin và phân quyền',
            icon: 'fas fa-users-cog',
            path: '/system/user-manage',
            color: '#4CAF50'
        },
        {
            title: 'menu.admin.manage-doctor',
            description: 'Quản lý thông tin bác sĩ và chuyên khoa',
            icon: 'fas fa-user-md',
            path: '/system/manage-doctor',
            color: '#2196F3'
        },
        {
            title: 'menu.admin.doctor-schedule',
            description: 'Quản lý lịch làm việc của bác sĩ',
            icon: 'fas fa-calendar-alt',
            path: '/system/doctor-schedule',
            color: '#FF9800'
        },
        {
            title: 'menu.admin.manage-specialty',
            description: 'Quản lý các chuyên khoa và dịch vụ',
            icon: 'fas fa-stethoscope',
            path: '/system/manage-specialty',
            color: '#9C27B0'
        },
        {
            title: 'menu.admin.appointment-management',
            description: 'Quản lý lịch hẹn và đặt khám',
            icon: 'fas fa-calendar-check',
            path: '/system/appointment-management',
            color: '#F44336'
        },
        {
            title: 'menu.admin.user-redux',
            description: 'Quản lý người dùng với Redux',
            icon: 'fas fa-database',
            path: '/system/user-redux',
            color: '#607D8B'
        },
        {
            title: 'menu.admin.revenue-dashboard',
            description: 'Quản lý doanh thu và báo cáo tài chính',
            icon: 'fas fa-chart-line',
            path: '/system/revenue-dashboard',
            color: '#00BCD4'
        }
    ];

    const handleFeatureClick = (path) => {
        history.push(path);
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    <FormattedMessage id="admin.dashboard.title" defaultMessage="Admin Dashboard" />
                </h1>
                <p className="dashboard-subtitle">
                    <FormattedMessage id="admin.dashboard.welcome" defaultMessage="Welcome back" />
                    , {userInfo?.firstName} {userInfo?.lastName}!
                </p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p>1,234</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-user-md"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Doctors</h3>
                        <p>89</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Appointments</h3>
                        <p>456</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-hospital"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Specialties</h3>
                        <p>15</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Monthly Revenue</h3>
                        <p>₫25,000,000</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-features">
                <h2 className="features-title">
                    <FormattedMessage id="admin.dashboard.quick-access" defaultMessage="Quick Access" />
                </h2>
                <div className="features-grid">
                    {adminFeatures.map((feature, index) => (
                        <div 
                            key={index} 
                            className="feature-card"
                            onClick={() => handleFeatureClick(feature.path)}
                            style={{ borderLeft: `4px solid ${feature.color}` }}
                        >
                            <div className="feature-icon" style={{ color: feature.color }}>
                                <i className={feature.icon}></i>
                            </div>
                            <div className="feature-content">
                                <h3>
                                    <FormattedMessage id={feature.title} defaultMessage={feature.title} />
                                </h3>
                                <p>{feature.description}</p>
                            </div>
                            <div className="feature-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps)(AdminDashboard); 